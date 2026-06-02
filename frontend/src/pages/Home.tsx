import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import Agenda from "../sections/Agenda";
import Invite from "../sections/Invite";
import Simulation from "../sections/Simulation";
function App() {
  return (
    <div className="min-h-svh bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <div className="grid-fade">
        <Header />

        <main>
          <Hero />
          <Agenda />
          <Invite />
          <Simulation />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
