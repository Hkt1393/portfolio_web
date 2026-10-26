import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { About } from '../features/about/About'
import { Contact } from '../features/contact/Contact'
import { Experience } from '../features/experience/Experience'
import { Hero } from '../features/hero/Hero'
import { Projects } from '../features/projects/Projects'
import { Services } from '../features/services/Services'
import { Skills } from '../features/skills/Skills'

export default function App() {
  return <><Navbar /><main id="home"><Hero /><About /><Skills /><Projects /><Services /><Experience /><Contact /></main><Footer /></>
}
