import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { SectorCard } from "@/components/services/sector_card";

export async function ServingSector() {
  const sectors = await prisma.targetSector.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <section className="space-y-6" id="sectors">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          <Tx en="Target Sectors & Industry Expertise" fr="Secteurs Cibles et Expertise Métier" />
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          <Tx
            en="Software solutions custom-tailored for the operational demands of specialized industries."
            fr="Solutions logicielles adaptées sur mesure aux exigences opérationnelles des secteurs spécialisés."
          />
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} />
        ))}
      </div>
    </section>
  );
}
