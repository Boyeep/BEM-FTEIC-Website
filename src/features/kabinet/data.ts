export interface KabinetMember {
  name: string;
  position: string;
  imageUrl?: string | null;
}

export interface KabinetDivision {
  slug: string;
  title: string;
  description: string;
  members: KabinetMember[];
}

const DEFAULT_MEMBERS: KabinetMember[] = Array.from({ length: 6 }).map(
  (_, index) => ({
    name: `Nama ${index + 1}`,
    position: "Jabatan",
    imageUrl: null,
  }),
);

function withDefaultMembers(
  division: Omit<KabinetDivision, "members">,
): KabinetDivision {
  return {
    ...division,
    members: DEFAULT_MEMBERS.map((member) => ({ ...member })),
  };
}

export const KABINET_DIVISIONS: KabinetDivision[] = [
  withDefaultMembers({
    slug: "bph",
    title: "BPH Division",
    description:
      "The BPH (Badan Perwakilan Himpunan) is responsible for ensuring the effectiveness, accountability, and sustainability of all organizational programs within the Himpunan Student Executive Board of FTEIC. This body plays a vital role in monitoring program implementation, evaluating quarterly achievements, and maintaining structured reporting systems across all departments.",
  }),
  withDefaultMembers({
    slug: "organizational-affairs",
    title: "Organizational Affairs Division",
    description:
      "The Organizational Affairs Department within the Student Executive Board is responsible for ensuring the effectiveness, accountability, and sustainability of all organizational programs in BEM FTEIC. This department plays a vital role in monitoring program implementation, evaluating quarterly achievements, and maintaining structured reporting systems across all departments.",
  }),
  withDefaultMembers({
    slug: "department-secretary",
    title: "Department Secretary (SekDep) Division",
    description:
      "Department Secretary is an individual entrusted with the responsibilities of organizing and maintaining records, managing correspondence, and performing various administrative tasks on behalf of an organization or an individual.",
  }),
  withDefaultMembers({
    slug: "internal-affairs",
    title: "Internal Affairs (Dagri) Division",
    description:
      "The Department of Internal Affairs is a department that plays a role in maintaining and improving harmony among FTEIC students, as well as providing a platform for students to develop their interests and talents.",
  }),
  withDefaultMembers({
    slug: "external-affairs",
    title: "External Affairs (Lugri) Division",
    description:
      "This is a department in BEM FTEIC responsible for maintaining relationships with stakeholders and creating creative content related to BEM FTEIC. It acts as a bridge between BEM FTEIC and external parties, ensuring effective communication and collaboration. Additionally, it oversees the production of engaging and innovative content that reflects the goals and activities of BEM FTEIC, aiming to inform, inspire, and connect with its audience.",
  }),
  withDefaultMembers({
    slug: "entrepreneurship",
    title: "Entrepreneurship (KWU) Division",
    description:
      "The Entrepreneurship Department of BEM FTEIC assists students in cultivating creative ideas and establishing innovative businesses. It fosters a business mindset among students and motivates them to pursue success as entrepreneurs.",
  }),
  withDefaultMembers({
    slug: "student-resource-development",
    title: "Student Resource Development (PSDM) Division",
    description:
      "Student Resource Development is one of the departments within BEM FTEIC ITS tasked with nurturing FTEIC students to enhance their quality, optimize their potential, boost competitiveness, and mold their character.",
  }),
  withDefaultMembers({
    slug: "social-affairs-and-community",
    title: "Social Affairs and Community (Sosmas) Division",
    description:
      "The Department of Social and Community Affairs within BEM FTEIC ITS is dedicated to social work and community service. It acts as a platform to connect FTEIC students, encouraging their engagement and awareness of social issues and activities.",
  }),
  withDefaultMembers({
    slug: "research-and-technology",
    title: "Research and Technology (Ristek) Division",
    description:
      "The Department of Research and Technology within the Student Executive Board is tasked with advancing knowledge and technology within the campus community. It plays a crucial role in developing the competence and skills of students in the technological field.",
  }),
];

export function getKabinetDivisionBySlug(slug: string) {
  return KABINET_DIVISIONS.find((item) => item.slug === slug);
}
