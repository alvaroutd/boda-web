// Soporta negrita simple: escribe **así** en el texto para que salga en negrita.
export default function RichText({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith("**") && parte.endsWith("**") ? (
          <strong key={i}>{parte.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{parte}</span>
        )
      )}
    </>
  );
}
