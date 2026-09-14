import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  NOMBRES,
  FECHA_BODA_ISO,
  FECHA_TEXTO,
  HORA_CONVOCATORIA,
  LUGAR,
  MOMENTOS_DEL_DIA,
  FAQ,
} from "./content";

export type SiteContent = {
  novio1: string;
  novio2: string;
  fechaBodaIso: string;
  fechaTexto: string;
  horaConvocatoria: string;
  lugarNombre: string;
  lugarDireccion: string;
  lugarMapaEmbedSrc: string;
  momentosDelDia: string[];
  infoAdicional: string;
  comoLlegarTexto: string;
  faq: { pregunta: string; respuesta: string }[];
  heroImage: string | null;
};

// Directorio persistente fuera del despliegue Git, para que los cambios
// guardados desde /admin no se pierdan al hacer un nuevo deploy.
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

function defaultContent(): SiteContent {
  return {
    novio1: NOMBRES.novio1,
    novio2: NOMBRES.novio2,
    fechaBodaIso: FECHA_BODA_ISO,
    fechaTexto: FECHA_TEXTO,
    horaConvocatoria: HORA_CONVOCATORIA,
    lugarNombre: LUGAR.nombre,
    lugarDireccion: LUGAR.direccionCompleta,
    lugarMapaEmbedSrc: LUGAR.mapaEmbedSrc,
    momentosDelDia: MOMENTOS_DEL_DIA,
    infoAdicional: "",
    comoLlegarTexto: "",
    faq: FAQ,
    heroImage: null,
  };
}

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(CONTENT_FILE, "utf-8");
    return { ...defaultContent(), ...JSON.parse(raw) };
  } catch {
    return defaultContent();
  }
}

export async function saveContent(content: SiteContent) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}
