import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "./content-store";

export type Rsvp = {
  id: string;
  nombre: string;
  asistencia: "si" | "no";
  acompanantes: number;
  nombresAcompanantes: string;
  alergias: string;
  fecha: string;
};

const RSVP_FILE = path.join(DATA_DIR, "rsvps.json");

export async function getRsvps(): Promise<Rsvp[]> {
  try {
    const raw = await readFile(RSVP_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveRsvps(rsvps: Rsvp[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(RSVP_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
}

export async function addRsvp(entry: Omit<Rsvp, "id" | "fecha">) {
  const rsvps = await getRsvps();
  const nuevo: Rsvp = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fecha: new Date().toISOString(),
  };
  rsvps.push(nuevo);
  await saveRsvps(rsvps);
  return nuevo;
}

export async function deleteRsvp(id: string) {
  const rsvps = await getRsvps();
  await saveRsvps(rsvps.filter((r) => r.id !== id));
}
