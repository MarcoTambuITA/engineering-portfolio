import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Involvement from "@/components/sections/Involvement";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";
import { getAllProjects } from "@/lib/projects";

export default function Home() {
  const projects = getAllProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects projects={projects} />
        <Involvement />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
