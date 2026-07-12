import { UserChip } from "@/components/ui/UserChip";
import { mockStaff } from "@/lib/mock/data";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getLawyerDetails(name: string) {
  const staff = mockStaff.find((member) => member.name === name);
  return {
    name,
    initials: staff?.initials ?? getInitials(name),
  };
}

interface AssignedLawyersProps {
  lawyers: string[];
}

export function AssignedLawyers({ lawyers }: AssignedLawyersProps) {
  if (lawyers.length === 0) {
    return <span className="text-text-muted">—</span>;
  }

  return (
    <div
      className="flex flex-wrap gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {lawyers.map((lawyer) => {
        const details = getLawyerDetails(lawyer);
        return (
          <UserChip
            key={lawyer}
            name={details.name}
            initials={details.initials}
            compactOnMobile
          />
        );
      })}
    </div>
  );
}
