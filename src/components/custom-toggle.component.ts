import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="getToggleClasses()"
      (click)="handleToggle()"
      [attr.aria-checked]="checked"
      role="switch"
    >
      <span [class]="getKnobClasses()"></span>
    </button>
  `,
  styles: [`
    .toggle {
      position: relative;
      width: 44px;
      height: 24px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
      flex-shrink: 0;
    }

    .toggle-inactive {
      background-color: var(--toggle-inactive);
    }

    .toggle-active {
      background-color: var(--toggle-active);
    }

    .toggle-will-change {
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.5);
    }

    @keyframes pulse-ring {
      0%, 100% {
        box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.5);
      }
      50% {
        box-shadow: 0 0 0 6px rgba(251, 146, 60, 0.3);
      }
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: white;
      transition: transform 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .toggle-knob-inactive {
      left: 2px;
    }

    .toggle-knob-active {
      transform: translateX(20px);
      left: 2px;
    }
  `]
})
export class CustomToggleComponent {
  @Input() checked: boolean = false;
  @Input() willChange: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  handleToggle() {
    this.checkedChange.emit(!this.checked);
  }

  getToggleClasses(): string {
    const classes = ['toggle'];
    if (this.checked) {
      classes.push('toggle-active');
    } else {
      classes.push('toggle-inactive');
    }
    if (this.willChange) {
      classes.push('toggle-will-change');
    }
    return classes.join(' ');
  }

  getKnobClasses(): string {
    const classes = ['toggle-knob'];
    if (this.checked) {
      classes.push('toggle-knob-active');
    } else {
      classes.push('toggle-knob-inactive');
    }
    return classes.join(' ');
  }
}
