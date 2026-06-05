import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Involvement from "@/components/sections/Involvement";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";
import { getAllProjects } from "@/lib/projects";
import { getAllInvolvements } from "@/lib/involvement";
import { getAllExperiences } from "@/lib/experience";

export default function Home() {
  const projects = getAllProjects();
  const involvements = getAllInvolvements();
  const experiences = getAllExperiences();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Involvement involvements={involvements} />
        <Skills />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
