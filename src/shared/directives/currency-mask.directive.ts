import { Directive, ElementRef, EventEmitter, HostListener, forwardRef, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true,
    },
  ],
  host: {
    autocomplete: 'off',
    inputmode: 'decimal',
  },
})
export class CurrencyMaskDirective implements OnInit, OnDestroy, ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private value: number | null = null;

  @Output() public readonly numericValueChange = new EventEmitter<number | null>();

  private onChange: (value: number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public ngOnInit(): void {
    this.writeFormatted(this.value);
  }

  public ngOnDestroy(): void {
    return;
  }

  public writeValue(value: number | null): void {
    this.value = this.coerce(value);
    this.writeFormatted(this.value);
  }

  public registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    const rawValue = inputElement?.value ?? '';
    const numericValue = this.parseCurrencyInput(rawValue);

    this.value = numericValue;
    this.numericValueChange.emit(numericValue);
    this.onChange(numericValue);

    this.writeFormatted(numericValue);
    this.placeCaretAtEnd();
  }

  @HostListener('focus')
  public onFocus(): void {
    this.writePlain(this.value);
  }

  @HostListener('blur')
  public onBlur(): void {
    this.onTouched();
    this.writeFormatted(this.value);
  }

  private writeFormatted(value: number | null): void {
    this.elementRef.nativeElement.value = value === null ? '' : this.formatter.format(value);
  }

  private writePlain(value: number | null): void {
    this.elementRef.nativeElement.value = value === null ? '' : String(Math.round(value * 100));
    this.placeCaretAtEnd();
  }

  private parseCurrencyInput(value: string): number | null {
    if (value.trim() === '') {
      return null;
    }

    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly === '') {
      return null;
    }

    const cents = Number(digitsOnly);
    return Number.isFinite(cents) ? cents / 100 : null;
  }

  private coerce(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      return this.parseCurrencyInput(value);
    }

    return null;
  }

  private placeCaretAtEnd(): void {
    const element = this.elementRef.nativeElement;
    const length = element.value.length;
    queueMicrotask(() => {
      try {
        element.setSelectionRange(length, length);
      } catch {
        return;
      }
    });
  }
}
