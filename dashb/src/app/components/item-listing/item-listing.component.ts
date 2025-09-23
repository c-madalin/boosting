import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-listing.component.html',
  styleUrls: ['./item-listing.component.scss']
})
export class ItemListingComponent implements OnInit, OnDestroy {
  @Input() categories: string[] = [];
  @Input() feePercent = 10;
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  subs = new Subscription();

  itemTypes = ['Account', 'Boosting', 'Currency', 'Items', 'Top Up'];

  readonly currency = 'EUR'; // EUR fix (cerința ta)
  get currencySymbol(): string { return '€'; }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      slug: ['', [Validators.maxLength(140)]],

      // preț + cantități
      price: [0, [Validators.required, Validators.min(0.01)]],
      game: ['', Validators.required],
      image: [null],
      description: ['', [Validators.maxLength(500)]],

      // game specific
      itemType: [''],

      // stock
      stock: [1, [Validators.required, Validators.min(1)]],
      minQty: [1, [Validators.required, Validators.min(1)]],
      deliveryTime: [10, [Validators.required, Validators.min(1)]],
      deliveryTimeUnit: ['Minutes', Validators.required],

      // opțional
      deliveryInstructions: ['']
    });
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // calcule
  get originalPrice(): number {
    const p = Number(this.form?.get('price')?.value ?? 0);
    const q = Number(this.form?.get('minQty')?.value ?? 0);
    return p > 0 && q > 0 ? p * q : 0;
  }
  get feeAmount(): number { return this.originalPrice * (Number(this.feePercent) / 100); }
  get sellerGets(): number { return Math.max(this.originalPrice - this.feeAmount, 0); }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.form.patchValue({ image: file });
  }

  cancel() { this.cancelled.emit(); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.submitted.emit({
      ...v,
      currency: this.currency,
      breakdown: {
        currency: this.currency,
        originalPrice: this.originalPrice,
        feePercent: this.feePercent,
        feeAmount: this.feeAmount,
        amountYouReceive: this.sellerGets
      }
    });
  }
}
