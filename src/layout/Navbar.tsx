import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronDown, Copy, Check } from "lucide-react";
import { routePaths } from "@/config/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth.context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { label: "Home", path: routePaths.home },
  { label: "Ecosystem", path: routePaths.ecosystem },
  { label: "NFTs", path: routePaths.nfts },
  { label: "Marketplace", path: routePaths.marketplace },
  { label: "DeFiHub", path: routePaths.defihub },
] as const;

interface NavbarProps {
  onConnectWallet: () => void;
  onLogout: () => void;
}

export function Navbar({ onConnectWallet, onLogout }: NavbarProps) {
  const { account, chainId } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const location = useLocation();

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? "bg-background/80 backdrop-blur-xl border-b border-border"
    : "bg-transparent";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        navBg,
      )}
      style={{ height: "var(--navbar-h)" }}
    >
      <div className="section-container h-full flex items-center justify-between gap-6">
        <Link
          to={routePaths.home}
          className="text-xl font-heading font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity shrink-0"
          aria-label="Arn-Apex Home"
        >
          <span className="text-gradient">Arn-Apex</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button
            asChild
            size="sm"
            className="rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to={routePaths.gameplay}>Play</Link>
          </Button>
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-muted-foreground hover:text-foreground"
                >
                  {account.slice(0, 6) + "..." + account.slice(-4)}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleCopyAddress}
                  className="flex items-center justify-between cursor-pointer py-3 px-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium  hover:text-normal">
                      Wallet Address
                    </span>
                    <span className="font-mono text-sm break-all">
                      {account}
                    </span>
                  </div>
                  {copyFeedback ? (
                    <Check className="ml-2 h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Copy className="ml-2 h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </DropdownMenuItem>
                <div className="my-1 h-px bg-border" />
                <DropdownMenuItem asChild>
                  <Link to={routePaths.about}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-muted-foreground hover:text-foreground"
              onClick={onConnectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(320px,100vw)] flex flex-col gap-6 pt-8"
          >
            <nav className="flex flex-col gap-1" aria-label="Main mobile">
              {navItems.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === path
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-auto">
              <Button asChild className="rounded-lg font-semibold" size="lg">
                <Link
                  to={routePaths.gameplay}
                  onClick={() => setMobileOpen(false)}
                >
                  Play
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-lg"
                onClick={() => {
                  onConnectWallet();
                  setMobileOpen(false);
                }}
              >
                Connect Wallet
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
