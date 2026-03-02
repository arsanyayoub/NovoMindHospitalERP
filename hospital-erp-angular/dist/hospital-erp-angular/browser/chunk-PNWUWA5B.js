import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-GVBL3DCA.js";
import {
  ToastService
} from "./chunk-DM7YHZMX.js";
import {
  InventoryService
} from "./chunk-56O4OOG6.js";
import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgForOf,
  NgIf,
  TranslateModule,
  TranslatePipe,
  __spreadValues,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QQTHLIA4.js";

// src/app/features/inventory/inventory.component.ts
function InventoryComponent_div_15_tr_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 17);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td")(15, "button", 18);
    \u0275\u0275listener("click", function InventoryComponent_div_15_tr_28_Template_button_click_15_listener() {
      const i_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editItem(i_r4));
    });
    \u0275\u0275elementStart(16, "span", 19);
    \u0275\u0275text(17, "edit");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const i_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(i_r4.itemCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r4.itemName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r4.category);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 5, i_r4.salePrice));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 7, i_r4.purchasePrice));
  }
}
function InventoryComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "div", 7)(3, "span", 8);
    \u0275\u0275text(4, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 9);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_15_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.search, $event) || (ctx_r1.search = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function InventoryComponent_div_15_Template_input_input_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadItems());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 10);
    \u0275\u0275listener("click", function InventoryComponent_div_15_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.showItemForm = true;
      return \u0275\u0275resetView(ctx_r1.itemForm = {});
    });
    \u0275\u0275elementStart(8, "span", 11);
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 12)(11, "div", 13)(12, "table", 14)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Sale Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Purchase Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "tbody");
    \u0275\u0275template(28, InventoryComponent_div_15_tr_28_Template, 18, 9, "tr", 15);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(6, 3, "SEARCH"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.search);
    \u0275\u0275advance(23);
    \u0275\u0275property("ngForOf", ctx_r1.items);
  }
}
function InventoryComponent_div_16_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "span", 20);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r6.itemName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r6.warehouseName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r6.quantity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r6.reorderLevel);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", s_r6.isLowStock ? "badge-danger" : "badge-success");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r6.isLowStock ? "Low" : "OK");
  }
}
function InventoryComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 10);
    \u0275\u0275listener("click", function InventoryComponent_div_16_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showTransfer = true);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "swap_horiz");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 12)(11, "div", 13)(12, "table", 14)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Item");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Warehouse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Qty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Reorder Level");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Status");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "tbody");
    \u0275\u0275template(26, InventoryComponent_div_16_tr_26_Template, 12, 6, "tr", 15);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "STOCK"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 5, "STOCK_TRANSFER"), "");
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.stock);
  }
}
function InventoryComponent_div_17_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "h4")(2, "span", 24);
    \u0275\u0275text(3, "warehouse");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 25);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 26);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const w_r8 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(w_r8.warehouseName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(w_r8.location || "No location");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(w_r8.warehouseCode);
  }
}
function InventoryComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 10);
    \u0275\u0275listener("click", function InventoryComponent_div_17_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.showWhForm = true;
      return \u0275\u0275resetView(ctx_r1.whForm = {});
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "add");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 21);
    \u0275\u0275template(9, InventoryComponent_div_17_div_9_Template, 9, 3, "div", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, "WAREHOUSES"));
    \u0275\u0275advance(6);
    \u0275\u0275property("ngForOf", ctx_r1.warehouses);
  }
}
function InventoryComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("click", function InventoryComponent_div_18_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showItemForm = false);
    });
    \u0275\u0275elementStart(1, "div", 28);
    \u0275\u0275listener("click", function InventoryComponent_div_18_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 29)(3, "h3", 30);
    \u0275\u0275text(4, "Item");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function InventoryComponent_div_18_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showItemForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 31)(9, "div", 32)(10, "div", 33)(11, "label", 34);
    \u0275\u0275text(12, "Name (EN) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.itemName, $event) || (ctx_r1.itemForm.itemName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 33)(15, "label", 34);
    \u0275\u0275text(16, "Name (AR)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.itemNameAr, $event) || (ctx_r1.itemForm.itemNameAr = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 37)(19, "div", 33)(20, "label", 34);
    \u0275\u0275text(21, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.category, $event) || (ctx_r1.itemForm.category = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 33)(24, "label", 34);
    \u0275\u0275text(25, "Unit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.unit, $event) || (ctx_r1.itemForm.unit = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 37)(28, "div", 33)(29, "label", 34);
    \u0275\u0275text(30, "Sale Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.salePrice, $event) || (ctx_r1.itemForm.salePrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 33)(33, "label", 34);
    \u0275\u0275text(34, "Purchase Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.purchasePrice, $event) || (ctx_r1.itemForm.purchasePrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div", 37)(37, "div", 33)(38, "label", 34);
    \u0275\u0275text(39, "Tax Rate %");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.taxRate, $event) || (ctx_r1.itemForm.taxRate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 33)(42, "label", 34);
    \u0275\u0275text(43, "Barcode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_18_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.itemForm.barcode, $event) || (ctx_r1.itemForm.barcode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(45, "div", 40)(46, "button", 41);
    \u0275\u0275listener("click", function InventoryComponent_div_18_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showItemForm = false);
    });
    \u0275\u0275text(47);
    \u0275\u0275pipe(48, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "button", 42);
    \u0275\u0275listener("click", function InventoryComponent_div_18_Template_button_click_49_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveItem());
    });
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.itemName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.itemNameAr);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.category);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.unit);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.salePrice);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.purchasePrice);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.taxRate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.itemForm.barcode);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(48, 10, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 12, "SAVE"));
  }
}
function InventoryComponent_div_19_option_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r11 = ctx.$implicit;
    \u0275\u0275property("ngValue", i_r11.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r11.itemName);
  }
}
function InventoryComponent_div_19_option_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r12 = ctx.$implicit;
    \u0275\u0275property("ngValue", w_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r12.warehouseName);
  }
}
function InventoryComponent_div_19_option_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r13 = ctx.$implicit;
    \u0275\u0275property("ngValue", w_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r13.warehouseName);
  }
}
function InventoryComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("click", function InventoryComponent_div_19_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showTransfer = false);
    });
    \u0275\u0275elementStart(1, "div", 28);
    \u0275\u0275listener("click", function InventoryComponent_div_19_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 29)(3, "h3", 30);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 18);
    \u0275\u0275listener("click", function InventoryComponent_div_19_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showTransfer = false);
    });
    \u0275\u0275elementStart(7, "span", 11);
    \u0275\u0275text(8, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 31)(10, "div", 33)(11, "label", 34);
    \u0275\u0275text(12, "Item");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "select", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_19_Template_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.transForm.itemId, $event) || (ctx_r1.transForm.itemId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(14, InventoryComponent_div_19_option_14_Template, 2, 2, "option", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 37)(16, "div", 33)(17, "label", 34);
    \u0275\u0275text(18, "From Warehouse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "select", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_19_Template_select_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.transForm.fromWarehouseId, $event) || (ctx_r1.transForm.fromWarehouseId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(20, InventoryComponent_div_19_option_20_Template, 2, 2, "option", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 33)(22, "label", 34);
    \u0275\u0275text(23, "To Warehouse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "select", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_19_Template_select_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.transForm.toWarehouseId, $event) || (ctx_r1.transForm.toWarehouseId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(25, InventoryComponent_div_19_option_25_Template, 2, 2, "option", 43);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 44)(27, "label", 34);
    \u0275\u0275text(28, "Quantity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_19_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.transForm.quantity, $event) || (ctx_r1.transForm.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 40)(31, "button", 41);
    \u0275\u0275listener("click", function InventoryComponent_div_19_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showTransfer = false);
    });
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "button", 42);
    \u0275\u0275listener("click", function InventoryComponent_div_19_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.transfer());
    });
    \u0275\u0275text(35);
    \u0275\u0275pipe(36, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 10, "STOCK_TRANSFER"));
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.transForm.itemId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.items);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.transForm.fromWarehouseId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.warehouses);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.transForm.toWarehouseId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.warehouses);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.transForm.quantity);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(33, 12, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(36, 14, "CONFIRM"));
  }
}
function InventoryComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("click", function InventoryComponent_div_20_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showWhForm = false);
    });
    \u0275\u0275elementStart(1, "div", 28);
    \u0275\u0275listener("click", function InventoryComponent_div_20_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r14);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 29)(3, "h3");
    \u0275\u0275text(4, "New Warehouse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function InventoryComponent_div_20_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showWhForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 31)(9, "div", 33)(10, "label", 34);
    \u0275\u0275text(11, "Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_20_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.whForm.warehouseName, $event) || (ctx_r1.whForm.warehouseName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 44)(14, "label", 34);
    \u0275\u0275text(15, "Location");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function InventoryComponent_div_20_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.whForm.location, $event) || (ctx_r1.whForm.location = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 40)(18, "button", 41);
    \u0275\u0275listener("click", function InventoryComponent_div_20_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showWhForm = false);
    });
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "button", 42);
    \u0275\u0275listener("click", function InventoryComponent_div_20_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveWh());
    });
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.whForm.warehouseName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.whForm.location);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 4, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 6, "SAVE"));
  }
}
var InventoryComponent = class _InventoryComponent {
  constructor(svc, toast) {
    this.svc = svc;
    this.toast = toast;
    this.tab = "items";
    this.items = [];
    this.stock = [];
    this.warehouses = [];
    this.search = "";
    this.showItemForm = false;
    this.showTransfer = false;
    this.showWhForm = false;
    this.itemForm = {};
    this.transForm = {};
    this.whForm = {};
  }
  editItem(i) {
    this.showItemForm = true;
    this.itemForm = __spreadValues({}, i);
  }
  ngOnInit() {
    this.loadItems();
    this.loadWarehouses();
  }
  loadItems() {
    this.svc.getItems({ search: this.search }).subscribe((r) => this.items = r.items);
  }
  loadStock() {
    this.svc.getStock().subscribe((s) => this.stock = s);
  }
  loadWarehouses() {
    this.svc.getWarehouses().subscribe((w) => this.warehouses = w);
  }
  saveItem() {
    const obs = this.itemForm.id ? this.svc.updateItem(this.itemForm.id, this.itemForm) : this.svc.createItem(this.itemForm);
    obs.subscribe({ next: () => {
      this.toast.success("Saved");
      this.showItemForm = false;
      this.loadItems();
    }, error: () => this.toast.error("Error") });
  }
  transfer() {
    this.svc.transferStock(this.transForm).subscribe({ next: () => {
      this.toast.success("Transferred");
      this.showTransfer = false;
      this.loadStock();
    }, error: (e) => this.toast.error(e.error?.message || "Error") });
  }
  saveWh() {
    this.svc.createWarehouse(this.whForm).subscribe({ next: () => {
      this.toast.success("Saved");
      this.showWhForm = false;
      this.loadWarehouses();
    } });
  }
  static {
    this.\u0275fac = function InventoryComponent_Factory(t) {
      return new (t || _InventoryComponent)(\u0275\u0275directiveInject(InventoryService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InventoryComponent, selectors: [["app-inventory"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 21, vars: 30, consts: [[1, "page-header"], [1, "page-title"], [1, "flex", "gap-2"], [1, "btn", 3, "click"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "material-icons-round"], [1, "card", 2, "padding", "0"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [1, "badge", "badge-primary"], [1, "font-semibold"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "badge", 3, "ngClass"], [1, "card-grid"], ["class", "card", 4, "ngFor", "ngForOf"], [1, "card"], [1, "material-icons-round", 2, "color", "var(--accent)", "vertical-align", "middle", "margin-inline-end", "8px"], [1, "text-sm", "text-muted", "mt-2"], [1, "badge", "badge-info", "mt-2"], [1, "modal-overlay", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "ngModel"], ["dir", "rtl", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-row", "mt-4"], ["placeholder", "pcs, kg...", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "number", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [3, "ngValue", 4, "ngFor", "ngForOf"], [1, "form-group", "mt-4"], [3, "ngValue"]], template: function InventoryComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
        \u0275\u0275listener("click", function InventoryComponent_Template_button_click_6_listener() {
          return ctx.tab = "items";
        });
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 3);
        \u0275\u0275listener("click", function InventoryComponent_Template_button_click_9_listener() {
          ctx.tab = "stock";
          return ctx.loadStock();
        });
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 3);
        \u0275\u0275listener("click", function InventoryComponent_Template_button_click_12_listener() {
          ctx.tab = "warehouses";
          return ctx.loadWarehouses();
        });
        \u0275\u0275text(13);
        \u0275\u0275pipe(14, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(15, InventoryComponent_div_15_Template, 29, 5, "div", 4)(16, InventoryComponent_div_16_Template, 27, 7, "div", 4)(17, InventoryComponent_div_17_Template, 10, 4, "div", 4)(18, InventoryComponent_div_18_Template, 52, 14, "div", 5)(19, InventoryComponent_div_19_Template, 37, 16, "div", 5)(20, InventoryComponent_div_20_Template, 24, 8, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 22, "INVENTORY"));
        \u0275\u0275advance(3);
        \u0275\u0275classProp("btn-primary", ctx.tab === "items")("btn-secondary", ctx.tab !== "items");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 24, "ITEMS"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "stock")("btn-secondary", ctx.tab !== "stock");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 26, "STOCK"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "warehouses")("btn-secondary", ctx.tab !== "warehouses");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 28, "WAREHOUSES"));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.tab === "items");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "stock");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "warehouses");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showItemForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showTransfer);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showWhForm);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InventoryComponent, { className: "InventoryComponent", filePath: "src\\app\\features\\inventory\\inventory.component.ts", lineNumber: 93 });
})();
export {
  InventoryComponent
};
//# sourceMappingURL=chunk-PNWUWA5B.js.map
