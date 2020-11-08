import {Component, Inject, OnInit} from '@angular/core';
import * as smart from 'fhirclient';
import { DOCUMENT } from '@angular/common';
import {fhirclient} from 'fhirclient/lib/types';
import Client from 'fhirclient/lib/Client';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.css']
})
export class LaunchComponent implements OnInit {
  public patientData = null;
  // constructor(@Inject(DOCUMENT) private document: Document) {
  // }

  ngOnInit(): void {
      // The issuer goes here. I am using smartHealthIT for this application
      // tslint:disable-next-line:max-line-length
      // https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r4&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3Alocalhost%3A4200%2Flaunch&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sb=&sde=&sim_ehr=0&token_lifetime=15&user_pt=
    // SmartHealth Server: https://launch.smarthealthit.org/v/r4/fhir
    const issuer = 'https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/R4';
    const options = {
      // The client Id goes here
      clientId: 'client_id_for_epic_here',
      // The scope necessary for the operation of the application is declared -- For Epic the required scopes are below
      scope: 'launch launch/patient openid profile online_access',
      redirectUri: 'http://localhost:4200/launch',
      iss: issuer,
      completeInTarget: true
    };

    /*
     This gets a little tricky since I am doing the retrieval of data with init instead of authorize which would require me to use the
     code and get the bearer token When done this way you have to get all the FHIR resources you want at once which may not be what you
     want but I hope this helps get the general idea across.
      const auth = smart.oauth2.authorize(options); Another method is to use authorize.
    */

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


