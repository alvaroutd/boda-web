import Hero from "./components/Hero";
import Intro from "./components/Intro";
import ElDia from "./components/ElDia";
import Faq from "./components/Faq";
import SubeFotos from "./components/SubeFotos";
import Galeria from "./components/Galeria";
import { getContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <Hero content={content} />
      <Intro content={content} />
      <ElDia content={content} />
      <Faq content={content} />
      <SubeFotos />
      <Galeria />
    </main>
  );
}
