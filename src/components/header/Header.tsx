import { NAV_ITEMS, mailto } from '@/content/site';
import { Dot } from '../ui/Dot';
import { PeekingPill } from '../ui/PeekingPill';
import { HeaderShell } from './HeaderShell';
import { NavClose } from './NavClose';
import { NavLink } from './NavLink';
import { NavMenu } from './NavMenu';
import { NavProvider } from './NavProvider';
import { NavToggle } from './NavToggle';
import { SoundToggle } from './SoundToggle';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <HeaderShell>
      <nav className="nav container" aria-label="Main">
        <a href="#home" className="nav__logo">
          Sashank Deb
          <Dot />
        </a>

        <NavProvider>
          <NavMenu>
            <ul className="nav__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <NavLink id={item.id} label={item.label} icon={item.icon} />
                </li>
              ))}
            </ul>
            <NavClose />
          </NavMenu>

          <div className="nav__actions">
            <SoundToggle />
            <ThemeToggle />
            <PeekingPill
              className="pill--nav"
              href={mailto('Hi Sashank')}
              label="Contact"
              avatarSize={36}
            />
            <NavToggle />
          </div>
        </NavProvider>
      </nav>
    </HeaderShell>
  );
}
