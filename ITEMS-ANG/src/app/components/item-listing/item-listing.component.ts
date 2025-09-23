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
  @Input() categories: string[] = [];      // Game list (folosim ce primești din Home)
  @Input() feePercent = 10;                // pt. "You will get ..."
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  subs = new Subscription();

  // mock pentru Item Type – poți popula dinamic ulterior
  itemTypes = ['Account', 'Boosting', 'Currency', 'Items', 'Top Up'];

  currencyOptions = ['EUR', 'USD', 'GBP'];
  get currencySymbol(): string {
    const cur = this.form?.get('currency')?.value || 'EUR';
    return cur === 'USD' ? '$' : cur === 'GBP' ? '£' : '€';
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Main Item Info
      title: ['', [Validators.required, Validators.maxLength(120)]],
      slug: ['', [Validators.maxLength(140)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['EUR', Validators.required],
      game: ['', Validators.required],
      image: [null], // File | null
      description: ['', [Validators.maxLength(500)]],

      // Game specific
      itemType: [''],

      // Stock
      stock: [1, [Validators.required, Validators.min(1)]],
      minQty: [1, [Validators.required, Validators.min(1)]],
      deliveryTime: [10, [Validators.required, Validators.min(1)]],
      deliveryTimeUnit: ['Minutes', Validators.required],

      // Optional delivery notes
      deliveryInstructions: ['']
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // === Helpers pentru fee ===
  get originalPrice(): number {
    const p = Number(this.form?.get('price')?.value ?? 0);
    const qty = Number(this.form?.get('minQty')?.value ?? 0);
    return p > 0 && qty > 0 ? p * qty : 0;
  }
  get feeAmount(): number {
    return this.originalPrice * (Number(this.feePercent) / 100);
  }
  get sellerGets(): number {
    return Math.max(this.originalPrice - this.feeAmount, 0);
  }

  // file select
  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.form.patchValue({ image: file });
  }

  // UI
  cancel() {
    this.cancelled.emit();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.submitted.emit({
      ...v,
      breakdown: {
        currency: v.currency,
        originalPrice: this.originalPrice,
        feePercent: this.feePercent,
        feeAmount: this.feeAmount,
        amountYouReceive: this.sellerGets
      }
    });
  }
}
