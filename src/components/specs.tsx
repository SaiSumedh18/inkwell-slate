const specs = [
  ["Light", "Up to 300 lux at 30 cm. 1,800K to 6,500K."],
  ["Sound", "40 mm full-range speaker. Twelve built-in sleep sounds."],
  ["Controls", "Rotating dial with press to snooze. Touch strip on top for sunset mode."],
  ["Power", "USB-C, 15W adapter included. Alarms are kept for 72 hours if the power goes out."],
  ["Size and weight", "18 cm across, 6 cm deep. 640 g."],
  ["Materials", "Anodised aluminium ring. Frosted, recycled polycarbonate diffuser."],
];

export function Specs() {
  return (
    <section id="specs" className="bg-mist px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-headline font-semibold">Tech specs</h2>
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
