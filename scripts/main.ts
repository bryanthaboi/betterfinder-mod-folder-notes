import { locations, settings, storage, ui } from "betterfinder";
import type { ActivateHandler, CommandRunHandler, LocationChangedHandler, UINode } from "betterfinder";

interface Note {
  at: string;
  text: string;
}

const MAX_NOTES = 50;

const plain = (value: unknown): any => JSON.parse(JSON.stringify(value));

const keyFor = (folder: string): string => "notes:" + folder;

const stamp = (): string => new Date().toISOString().slice(0, 16).replace("T", " ");

async function load(folder: string): Promise<Note[]> {
  const stored = await storage.get(keyFor(folder));
  return Array.isArray(stored) ? (stored as unknown as Note[]) : [];
}

async function save(folder: string, notes: Note[]): Promise<void> {
  if (notes.length === 0) {
    await storage.delete(keyFor(folder));
  } else {
    await storage.set(keyFor(folder), plain(notes));
  }
}

async function render(): Promise<void> {
  const here = await locations.current();
  const notes = await load(here.id);
  const body: UINode[] = [
    { type: "text", text: here.title, label: "Current folder" },
    { type: "text", text: notes.length === 0 ? "no notes here yet" : notes.length + " notes", label: "Note count" },
  ];
  if (notes.length > 0) {
    body.push({
      type: "list",
      label: "Notes for this folder",
      items: notes.map((note, index) => ({ id: "note" + index, title: note.text, subtitle: note.at })).reverse(),
    });
  }
  body.push({ type: "divider" });
  body.push({ type: "text", text: "write the next note in settings, folder notes, then hit add", label: "How to add a note" });
  body.push({
    type: "hstack",
    children: [
      { type: "button", text: "Add", label: "Save the draft as a note on this folder", command: "add-note" },
      { type: "button", text: "Undo", label: "Remove the latest note", command: "remove-note" },
      { type: "button", text: "Clear", label: "Remove every note on this folder", command: "clear-notes" },
    ],
  });
  await ui.setPanel("notes", { type: "vstack", children: body });
}

export const activate: ActivateHandler = async (context, input) => {
  await render();
};

export const locationChanged: LocationChangedHandler = async (context, input) => {
  await render();
};

export const addNote: CommandRunHandler = async (context, input) => {
  const draft = await settings.get("draft");
  const text = typeof draft === "string" ? draft.trim() : "";
  if (text.length === 0) {
    return { message: "type a note in settings first (folder notes, next note)" };
  }
  const here = await locations.current();
  const notes = await load(here.id);
  notes.push({ at: stamp(), text });
  while (notes.length > MAX_NOTES) {
    notes.shift();
  }
  await save(here.id, notes);
  await settings.set("draft", "");
  await render();
  return { message: "note saved to " + here.title };
};

export const removeNote: CommandRunHandler = async (context, input) => {
  const here = await locations.current();
  const notes = await load(here.id);
  if (notes.length === 0) {
    return { message: "nothing to remove" };
  }
  notes.pop();
  await save(here.id, notes);
  await render();
  return { message: "removed the latest note" };
};

export const clearNotes: CommandRunHandler = async (context, input) => {
  const here = await locations.current();
  await save(here.id, []);
  await render();
  return { message: "notes cleared for " + here.title };
};
