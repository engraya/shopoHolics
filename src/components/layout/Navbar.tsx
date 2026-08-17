import { getAllCategories } from "@/lib/api/queries";
import NavbarShell from "./NavbarShell";

/**
 * Server shell: resolves the category list for the mega-menu and hands it to
 * the client header. The fetch is ISR-cached (CATEGORIES_REVALIDATE), and the
 * home page requests the same data, so this dedupes there.
 */
export default async function Navbar() {
  const categories = await getAllCategories();

  return <NavbarShell categories={categories} />;
}
