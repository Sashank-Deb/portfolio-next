import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const TABS = [
  { id: 'work', label: 'Work', icon: 'uil-briefcase-alt', panel: <p>Work panel</p> },
  {
    id: 'education',
    label: 'Education',
    icon: 'uil-graduation-cap',
    panel: <p>Education panel</p>,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: 'uil-trophy',
    panel: <p>Achievements panel</p>,
  },
];

describe('Tabs', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return 100;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
      configurable: true,
      get(this: HTMLElement) {
        return this.id === 'tab-education' ? 120 : 0;
      },
    });
  });

  it('renders an accessible tablist with the first tab selected', () => {
    render(<Tabs label="Qualification" tabs={TABS} />);
    expect(screen.getByRole('tablist', { name: 'Qualification' })).toHaveClass('tabs');
    const work = screen.getByRole('tab', { name: 'Work' });
    expect(work).toHaveAttribute('aria-selected', 'true');
    expect(work).toHaveAttribute('aria-controls', 'work');
    expect(screen.getByRole('tab', { name: 'Education' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Work panel');
    expect(screen.getByText('Education panel').parentElement).not.toBeVisible();
  });

  it('switches panels on click and slides the indicator under the tab', async () => {
    const { container } = render(<Tabs label="Qualification" tabs={TABS} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Education' }));
    expect(screen.getByRole('tab', { name: 'Education' })).toHaveClass('tabs__btn', 'is-active');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Education panel');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'tab-education');
    const indicator = container.querySelector('.tabs__indicator') as HTMLElement;
    expect(indicator.style.width).toBe('100px');
    expect(indicator.style.transform).toBe('translateX(120px)');
  });

  it('moves with the arrow keys, wrapping around, and focuses the new tab', async () => {
    render(<Tabs label="Qualification" tabs={TABS} />);
    const work = screen.getByRole('tab', { name: 'Work' });
    work.focus();
    await userEvent.keyboard('{ArrowLeft}');
    const achievements = screen.getByRole('tab', { name: 'Achievements' });
    expect(achievements).toHaveFocus();
    expect(achievements).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(work).toHaveFocus();
  });
});
