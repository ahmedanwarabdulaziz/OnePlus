import { getBranchesForHome, getCoursesForHome, getStaffForHome } from "@/lib/get-home-data";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const [initialBranches, initialCourses, initialStaff] = await Promise.all([
    getBranchesForHome(),
    getCoursesForHome(),
    getStaffForHome(),
  ]);

  return (
    <HomePageClient
      initialBranches={initialBranches}
      initialCourses={initialCourses}
      initialStaff={initialStaff}
    />
  );
}
