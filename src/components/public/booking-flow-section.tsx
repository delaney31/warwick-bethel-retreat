import { CalendarCheck, CreditCard, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: FileText,
    label: "Request dates",
    detail: "Share your stay, guest count, and notes. No charge while we review.",
  },
  {
    icon: CalendarCheck,
    label: "Host review",
    detail: "Your host personally approves each request — no instant, anonymous bookings.",
  },
  {
    icon: CreditCard,
    label: "Pay securely",
    detail: "After approval, complete checkout through Stripe — card or Apple Pay where available.",
  },
  {
    icon: Sparkles,
    label: "Stay confirmed",
    detail: "Once paid, your dates are secured on our calendar. Arrive to a prepared retreat.",
  },
] as const;

export function BookingFlowSection() {
  return (
    <section className="bg-stone-900 py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">
            How booking works
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">
            Thoughtful hosting, clear steps
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            We protect both your time and the calendar — every stay is invited, reviewed, and
            confirmed with intention.
          </p>
        </div>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative text-center lg:text-left">
                {index < STEPS.length - 1 && (
                  <span
                    className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-white/20 to-white/5 lg:block"
                    aria-hidden
                  />
                )}
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 lg:mx-0">
                  <Icon className="h-5 w-5 text-amber-300/90" strokeWidth={1.25} />
                </span>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-serif text-lg font-light">{step.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.detail}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex justify-center">
          <Button href="/book" size="lg">
            Request Your Stay
          </Button>
        </div>
      </div>
    </section>
  );
}
