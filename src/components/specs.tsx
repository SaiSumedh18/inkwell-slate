const specs = [
  ["Display", "10.3-inch e-ink, 226 ppi, with textured glass that feels like paper under the pen."],
  ["Pen", "Battery-free stylus with 4,096 pressure levels. Attaches magnetically to the side."],
  ["Battery", "Up to four weeks of normal use. Charges fully in 90 minutes over USB-C."],
  ["Storage", "32 GB, about 100,000 pages. Backed up over Wi-Fi when you choose."],
  ["Export", "PDF, PNG and plain text. Send by email or sync to your computer."],
  ["Size and weight", "246 × 188 × 5.1 mm. 390 g."],
];

export function Specs() {
  return (
    <section id="specs" className="bg-mist px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-headline font-medium">Tech specs</h2>
        <dl className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {specs.map(([term, detail]) => (
            <div key={term} className="grid gap-2 py-6 sm:grid-cols-3 sm:gap-8">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-muted sm:col-span-2">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
