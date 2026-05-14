"use client";

import {
  TiltCard,
  type TiltCardProps,
} from "@/registry/components/unlumen/tilt-card";

type TiltCardDemoProps = Pick<TiltCardProps, "badgeVariant"> & {
  rotationFactor?: number;
};

export const TiltCardDemo = ({
  badgeVariant = "success",
  rotationFactor = 11,
}: TiltCardDemoProps) => {
  return (
    <div className="flex w-full flex-wrap gap-6 items-center justify-center p-10 max-w-xl">
      {/* Split badge + image */}
      <div className="w-full">
        <TiltCard
          title="Starter Kit"
          description="Everything you need to ship a modern SaaS product fast."
          price="Free"
          badgeLabel="Popular"
          badgeVariant={badgeVariant}
          imageSrc="https://images.unsplash.com/photo-1707978813846-dbf6c4dfbbe3?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          imageAlt="dashboard screenshot"
          href="#"
          tiltProps={{ rotationFactor }}
        />
      </div>

      {/* Price only badge + image */}
      <div className="w-full">
        <TiltCard
          title="Pro Template"
          description="Advanced features for power users and growing teams."
          price="$49"
          imageSrc="https://images.unsplash.com/photo-1759834857095-4e172a6d03f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          imageAlt="analytics"
          href="#"
          tiltProps={{ rotationFactor }}
        />
      </div>

      {/* Split badge, warning, children */}
      <div className="w-full">
        <TiltCard
          title="Enterprise"
          description="SSO, audit logs, and dedicated infrastructure."
          price="$199"
          badgeLabel="Best value"
          badgeVariant="warning"
          href="#"
          tiltProps={{ rotationFactor }}
        >
          <ul className="text-xs text-muted-foreground space-y-1 mt-1">
            <li>✓ Unlimited seats</li>
            <li>✓ Priority support</li>
            <li>✓ Custom domain</li>
          </ul>
        </TiltCard>
      </div>
    </div>
  );
};
