"use client";

import InvitationOpening from "@/components/wedding/InvitationOpening";

export default function Home() {
  return (
    <main className="wedding-site">

      <div className="landscape-canvas">

        <div className="wedding-background" />

        <section className="invitation-viewport">

          <InvitationOpening />

        </section>

      </div>

    </main>
  );
}