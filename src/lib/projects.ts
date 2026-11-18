export interface Project {
  /** Client or site name, e.g. "Head office fit-out". */
  title: string;
  /** Town or city, e.g. "Kurunegala". */
  location: string;
  /** Short sector label shown as a chip, e.g. "Corporate", "Hospitality", "Education". */
  sector: string;
  /** Photo of the finished space: a file in /public (e.g. "/projects/head-office.jpg") or an https URL. */
  image: string;
  /** Optional one-line description. */
  summary?: string;
}

/**
 * Completed Rialto projects shown in the "Our projects" section on the home page.
 * The section stays hidden until at least one project is listed here.
 *
 * TODO(client): add real projects (name, town, sector, photo). Example:
 *   {
 *     title: "Head office fit-out",
 *     location: "Colombo 03",
 *     sector: "Corporate",
 *     image: "/projects/head-office.jpg",
 *     summary: "120 Rialto Essential chairs across three floors.",
 *   },
 */
export const PROJECTS: Project[] = [];
