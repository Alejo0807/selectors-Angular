import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { ConutrySmall, Country } from '../../interfaces/countries.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  countryForm: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]]
  })

  regions: string[] = [];
  countries: ConutrySmall[] = [];
  borders: ConutrySmall[] = [];

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;
    

    // this.countryForm.get('region')?.valueChanges
    //   .subscribe( region => {
        
    //     if (region) {    
    //       this.countriesService.getCountriesByRegion(region)
    //         .subscribe( resp => {
    //           this.countries = resp;
    //         })
    //     } else {
    //       this.countries = [];
    //     }
    //   })


    this.countryForm.get('region')?.valueChanges
      .pipe(
        tap( region => {
          this.countryForm.get('country')?.reset('');
        }),
        switchMap( region => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(( resp => {
        this.countries = resp
      })

      )

    this.countryForm.get('country')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.countryForm.get('border')?.reset('');
        }),
        switchMap( code => this.countriesService.getCountryByCode(code)),
        switchMap( country => this.countriesService.getCountriesByCode(country?.borders!))
      )
      .subscribe(( resp => {
        this.borders = resp || [];
      })

      )
    

  }

  save() {
    console.log(this.countryForm.value);  
  }

}
