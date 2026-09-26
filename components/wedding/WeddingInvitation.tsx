"use client";

import WeddingRibbon from "./WeddingRibbon";

export default function WeddingInvitation() {
  return (
    <main className="wedding-stage">
      <div className="paper-texture" />

      <div className="invitation-stage">
        <div className="invitation-card">
          <img
            src="/invitation/cover.png"
            alt="Avishek and Rima wedding invitation"
            className="invitation-cover"
            draggable={false}
          />

          <div className="ribbon-layer">
            <WeddingRibbon />
          </div>
        </div>
      </div>
    </main>
  );
}