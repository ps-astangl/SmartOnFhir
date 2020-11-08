import {Component, Inject, OnInit} from '@angular/core';
import * as smart from 'fhirclient';
import { DOCUMENT } from '@angular/common';
import {fhirclient} from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';
import {stringify} from 'querystring';
import * as FHIR from 'fhir';
import {Fhir} from 'fhir/fhir';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent implements OnInit {
  public patientData = null;
  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    const issuer = 'https://launch.smarthealthit.org/v/r4/fhir';
    const options = {
      clientId: 'prescriptions_app',
      // The scope necessary for the operation of the application is declared
      scope: [
        'launch',          // Get current context of the EHR
        'launch patient', // Context for patient
        'openid fhirUser',  // Get current user
      ].join(' '),
      redirectUri: 'http://localhost:4200/launch',
      iss: issuer
    };
    smart.oauth2.init(options).then(async (x) => {
      // @ts-ignore
      let patientObject: fhirclient['FHIR.Patient'];
      [patientObject] = await Promise.all([this.getPatient(x)]);
      this.patientData = JSON.stringify(patientObject);
    });
  }
  public getPatient(FhirClient: Client): Promise<fhirclient.FHIR.Patient> {
    return FhirClient.patient.read();
  }
}


