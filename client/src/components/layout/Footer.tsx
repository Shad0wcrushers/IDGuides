
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground leading-loose text-center md:text-left">
          &copy; {new Date().getFullYear()} IDHosting. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to="https://idhosting.dk/handelsbetingelser/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
          <Link 
            to="https://idhosting.dk/om-os/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About us
          </Link>
          <Link 
            to="https://client.idhosting.dk/submitticket.php?step=2&deptid=2" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
          <Link 
            to="https://dk.trustpilot.com/review/idhosting.dk" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Trustpilot
          </Link>
          <Link 
            to="https://discord.com/invite/9AVmS8dsRJ" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Discord
          </Link>
        </div>
      </div>
    </footer>
  );
}
