import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  Dimension,
  Measure,
  PivotGridAxis,
  averageAggregate,
  maxAggregate,
  minAggregate,
  sumAggregate,
  Aggregate,
} from '@progress/kendo-angular-pivotgrid';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { data } from './data';

interface ColumnSetting {
  field: string;
  title: string;
  format?: string;
  sticky?: boolean;
  type: 'text' | 'numeric' | 'boolean' | 'date';
}

@Component({
  selector: 'my-app',
  template: `
        <h3>Data Source Filtered By PIN: {{pin}}</h3>
        <kendo-grid  
          [kendoGridBinding]="dataFiltered" 
          [resizable]="true" 
          [autoSize]="true"
          [pageable]="true"
          [pageSize]="10"
          [resizable]="true">
          
        </kendo-grid>
        <br/>
        <h3>Kendo Grid PIN: {{pin}}</h3>
        <kendo-grid [kendoGridBinding]="newData">
          <kendo-grid-column
            *ngFor="let column of columns"
            field="{{ column.field }}"
            title="{{ column.title }}"
            format="{{ column.format }}"
            [sticky]="{{ column.sticky }}"
          ></kendo-grid-column>
        </kendo-grid>
        <br/>
        <h3>Kendo Pivot Grid PIN: {{pin}}</h3>
        <kendo-pivotgrid
            #myElement
            [kendoPivotLocalBinding]="dataFiltered"
            [filter] = "defaultFilter"
            [dimensions]="dimensions"
            [measures]="measures"
            [rowAxes]="defaultRowAxes"
            [columnAxes]="defaultColumnAxes"
            [measureAxes]="defaultMeasureAxes"
            [configurator]="true"
        > </kendo-pivotgrid>
        <br/>
        <kendo-pivotgrid
            #myElement
            [kendoPivotLocalBinding]="dataFiltered"
            [filter] = "defaultFilter"
            [dimensions]="dimensions"
            [measures]="measures"
            [rowAxes]="defaultRowAxes2"
            [columnAxes]="defaultColumnAxes2"
            [measureAxes]="defaultMeasureAxes"
            [configurator]="true"
        > </kendo-pivotgrid>
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
        .k-pivotgrid-row-headers table.k-pivotgrid-table {
            table-layout: auto;
        }
    `,
  ],
})
export class AppComponent implements AfterViewInit, OnInit {
  public data: any[] = data;
  public pin = 52414500; //1681851300
  public dataFiltered = data.filter((el) => el.PIN == this.pin);
  columns: ColumnSetting[] = [];
  newData: any[];
  ngOnInit(): void {
    let years = Array.from(
      new Set(this.dataFiltered.map((objeto) => objeto.TaxYear))
    );
    this.columns = years.map((value) => ({
      field: value.toString(),
      title: value.toString(),
      type: 'text',
      sticky: false,
    }));

    this.columns.unshift({
      field: 'column',
      title: 'Years',
      type: 'text',
      sticky: true,
    });

    let specificColumnsValues = [
      'AsmtId',
      'AsmtEventType',
      'RollCaste',
      'ChangeReason',
      'EventDate',
      'AsmtTranType',
    ];
    this.newData = [];

    specificColumnsValues.forEach((column) => {
      let obj: any = {};
      this.columns.forEach((col) => {
        if (col.field == 'column') obj[col.field] = column;
        else {
          obj[col.field] = Array.from(
            new Set(
              this.dataFiltered.map((objeto) => {
                if (objeto.TaxYear == Number(col.field)) {
                  return objeto[column];
                }
              })
            )
          ).find((value) => value !== undefined);
        }
      });
      this.newData.push(obj);
    });
    console.log(this.newData);
  }
  @ViewChild('myElement') elRef: ElementRef;

  ngAfterViewInit() {
    (<any>(
      this.elRef
    )).valuesTable.nativeElement.childNodes[0].childNodes[1].childNodes[0].childNodes[1].onclick =
      () => console.log('openDetail');
  }

  public valueAggregate: Aggregate = {
    init: (data) => {
      data.value = 'value' in data ? data.value : '-';
    },
    accumulate: (data, value) => {
      data.value = value;
    },
    merge: (src, dest) => {
      dest.value = src.value;
    },
    result: (data) => data.value,
    format: (value: string) => value,
  };
  public dimensions: { [key: string]: Dimension } = {
    PIN: {
      caption: 'PIN',
      displayValue: (item) => item.PIN,
      sortValue: (displayValue: string) => displayValue,
    },
    AsmtId: {
      caption: 'AsmtId',
      displayValue: (item) => item.AsmtId,
      sortValue: (displayValue: string) => displayValue,
    },
    TaxYear: {
      caption: 'TaxYear',
      displayValue: (item) => item.TaxYear,
      sortValue: (displayValue: string) => displayValue,
    },
    Attribute1Formatted: {
      caption: 'Attribute1Formatted',
      displayValue: (item) => item.Attribute1Formatted,
      sortValue: (displayValue: string) => displayValue,
    },
    RollCaste: {
      caption: 'RollCaste',
      displayValue: (item) => item.RollCaste,
      sortValue: (displayValue: string) => displayValue,
    },
    AsmtEventType: {
      caption: 'AsmtEventType',
      displayValue: (item) => item.AsmtEventType,
      sortValue: (displayValue: string) => displayValue,
    },
    ChangeReason: {
      caption: 'ChangeReason',
      displayValue: (item) => item.ChangeReason,
      sortValue: (displayValue: string) => displayValue,
    },
    EventDate: {
      caption: 'EventDate',
      displayValue: (item) => item.EventDate,
      sortValue: (displayValue: string) => displayValue,
    },
    ValueAmount: {
      caption: 'ValueAmount',
      displayValue: (item) => item.ValueAmount,
      sortValue: (displayValue: string) => displayValue,
    },
  };

  public measures: Measure[] = [
    {
      name: 'Value',
      value: (item: any): number => item.Attribute1Formatted,
      aggregate: this.valueAggregate,
    },
    {
      name: 'Total',
      value: (item: any): number => item.ValueAmount,
      aggregate: sumAggregate,
    },
    {
      name: 'Max',
      value: (item: any): number => item.ValueAmount,
      aggregate: maxAggregate,
    },
    {
      name: 'Min',
      value: (item: any): number => item.ValueAmount,
      aggregate: minAggregate,
    },
    {
      name: 'Average',
      value: (item: any): number => item.ValueAmount,
      aggregate: averageAggregate,
    },
  ];

  public defaultMeasureAxes: PivotGridAxis[] = [{ name: ['Total'] }];

  public defaultRowAxes: PivotGridAxis[] = [
    //{ name: ['PIN'], expand: true },
    //{ name: ['AsmtId'], expand: true },
    //{ name: ['AsmtEventType'], expand: true },
    { name: ['RollCaste'], expand: true },
    //{ name: ['ValueAmount'], expand: true },
    //{ name: ['ChangeReason'], expand: true },
    //{ name: ['EventDate'], expand: true },
  ];

  public defaultColumnAxes: PivotGridAxis[] = [
    //{ name: ['PIN'], expand: true },
    { name: ['TaxYear'], expand: true },
    //{ name: ['AsmtId'], expand: true },
  ];

  public defaultRowAxes2: PivotGridAxis[] = [
    //{ name: ['PIN'], expand: true },
    //{ name: ['AsmtId'], expand: true },
    { name: ['AsmtEventType'], expand: true },
    //{ name: ['RollCaste'], expand: true },
    //{ name: ['ValueAmount'], expand: true },
    //{ name: ['ChangeReason'], expand: true },
    //{ name: ['EventDate'], expand: true },
  ];

  public defaultColumnAxes2: PivotGridAxis[] = [
    //{ name: ['PIN'], expand: true },
    { name: ['TaxYear'], expand: true },
    //{ name: ['AsmtId'], expand: true },
  ];

  public defaultFilter: FilterDescriptor[] = [
    {
      field: 'PIN',
      operator: 'eq',
      value: this.pin,
    },
  ];
}
