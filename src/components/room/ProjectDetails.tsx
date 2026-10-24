"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { ProjectCover } from "@/components/ui/ProjectCover";
import type { ProjectCardData } from "@/types/project-card";

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-muted">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Everything about one project, shown in a popup from the TV. */
export function ProjectDetails({ project }: { project: ProjectCardData }) {
  const facts = [
    { label: "Category", value: project.categoryLabel },
    project.role && { label: "Role", value: project.role },
    project.period && { label: "Timeline", value: project.period },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <div className="space-y-7 p-6">
      <ProjectCover name={project.name} image={project.coverImage} priority sizes="640px" className="aspect-[16/9] rounded-[var(--r-md)] border border-border" />

      {(project.fullDescription ?? project.shortDescription) && (
        <p className="text-lg leading-relaxed text-foreground/90">{project.fullDescription ?? project.shortDescription}</p>
      )}

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs uppercase tracking-wider text-subtle">{fact.label}</dt>
            <dd className="mt-1">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {project.technologies.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
              {tech}
            </li>
          ))}
        </ul>
      )}

      <DetailList title="Key features" items={project.features} />
      <DetailList title="Challenges" items={project.challenges} />

      {project.gallery.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {project.gallery.map((image) => (
            <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-md)] border border-border">
              <Image src={image.src} alt={image.alt} fill sizes="320px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {(project.liveUrl || project.sourceUrl) && (
        <div className="flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Icon name="arrow-up-right" size={16} />
              Visit live site
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/60 px-5 text-sm font-medium text-primary">
              <Icon name="github" size={16} />
              View source
            </a>
          )}
        </div>
      )}
    </div>
  );
}
