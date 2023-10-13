/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { MaterialModule } from '@angular/material';
import { MaterialModule } from './material.module';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MdMenuModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdCardModule,
  MdRadioModule,
  MdCheckboxModule, MdTabsModule, MdChipsModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Md2Module } from 'md2';
import { ToasterModule } from 'angular2-toaster';
import { OrderByPipe } from './order-by.pipe';
import { UtcDatePipe } from './utc-date.pipe';

import { AppComponent } from './app.component';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { InterceptedHttp } from './http.interceptor'
import { httpFactory } from './http.factory';
import { SecurityFactory } from './http.security.factory';
import { SecurityInterceptedHttp } from './http.securityinterceptor';

// login components
import { loginContentClass } from './login/login.component';
import { ResetComponent } from './resetPassword/resetPassword.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { myPassword } from './directives/password/myPassword.directive';
import { myName } from './directives/name/myName.directive';
import { myMobileNumber } from './directives/MobileNumber/myMobileNumber.directive';
import { myEmail } from './directives/email/myEmail.directive';
import { MyDatePickerDirective } from './directives/date-picker/my-date-picker.directive';

// dashboard components
import { dashboardContentClass } from './dashboard/dashboard.component';

import { DashboardRowHeaderComponent } from './dashboard-row-header/dashboardRowHeader.component';
import { DashboardNavigationComponent } from './dashboard-navigation/dashboardNavigation.component';
import { DashboardUserIdComponent } from './dashboard-user-id/dashboardUserId.component';
import { ActivityThisWeekComponent } from './activity-this-week/activity-this-week.component';
import { AlertsNotificationComponent } from './alerts-notifications/alerts-notifications.component';
import { DailyTasksComponent } from './daily-tasks/daily-tasks.component';
import { NewsInformationsComponent } from './news-informations/news-informations.component';
import { RatingComponent } from './rating/rating.component';
import { WeatherWarningsComponent } from './weather-warnings/weather-warnings.component';
import { TrainingResourcesComponent } from './training-resources/training-resources.component';

// multi role screen component
import { MultiRoleScreenComponent } from './multi-role-screen/multi-role-screen.component';

// innerpage components
import { InnerpageComponent } from './innerpage-supervisor/innerpage.component';
import { ServiceRoleSelectionComponent } from './service-role-selection/service-role-selection.component';
import { UpdatesFromBeneficiaryComponent } from './updates-from-beneficiary/updates-from-beneficiary.component';
import { SetSecurityQuestionsComponent } from './set-security-questions/set-security-questions.component';

//mcts component

import { MctsAgentOutbondcallComponent } from './innerpage-agent/innerpage-agent.component';
import { OutbondCallWorklistComponent } from './outbound-worklist/outbound-worklist.component';
import { AgentSearchRecordsComponent } from './agent-search-records/agent-search-records.component';
import { AgentAllocateRecordsComponent } from './agent-allocate-records/agent-allocate-records.component';
import { OutbondCallHistoryComponent } from './outbound-call-history/outbound-call-history.component';
import { OutbondCallDocSelfNoComponent } from './outbound-call-screen/outbound-call-screen.component';
import { UploadexcelComponent } from './uploadexcel/uploadexcel.component';
import { ReallocationCallAgentComponent } from './reallocation-call-agent/reallocation-call-agent.component';
import { InnerQuestionerModalComponent } from './questionaire-modal/questionaire-modal.component';
import { InnerClosureOutbondcallComponent } from './closure-outboundcall/closure-outboundcall.component';
import { InnerMctsCallConfiguration } from './mcts-callconfiguration/mcts-callconfiguration.component';
import { NotificationsDialogComponent } from './notifications-dialog/notifications-dialog.component';
import { EditNotificationsComponent } from './edit-notifications/edit-notifications.component';
import { ViewVersionDetailsComponent } from './view-version-details/view-version-details.component';

// services
import { AuthGuard } from './services/authGuardService/auth-guard.services';
import { SaveFormsGuard } from './services/authGuardService/auth-guard.services';

import { loginService } from './services/loginService/login.service';
import { RegisterService } from './services/register-services/register-service';
import { dataService } from './services/dataService/data.service';
import { DashboardHttpServices } from './http-service/http-service.service';
import { HttpServices } from './services/http-services/http_services.service';
import { ACAService } from './services/supervisorService/agent-call-allocation.service';
import { KnowledgeManagementService } from './services/supervisorService/knowledge-management.service';
import { OCWService } from './services/mcts-agent/outbond-call-worklist/outbond-call-worklist.service';
import { AgentSearchRecordService } from './services/supervisorService/agent-search-records.service';
import { UploadexcelService } from './services/uploading-excel/uploadexcel.service';
import { CallAllocationService } from './services/supervisorService/call-configuration.service';
import { QuestionTypeService } from './services/supervisorService/question-type.service';
import { ConfigService } from './services/config/config.service';
import { NotificationService } from './services/notificationService/notification-service';
import { QuestionaireService } from './services/questionaireService/questionaire-service';
import { CallClosureService } from './services/mcts-agent/call-closure/call-closure.service';
import { CzentrixServices } from './services/czentrixService/czentrix.service';
import { LoaderService } from './services/common/loader.service';

import { ConfirmationDialogsService } from './services/dialog/confirmation.service';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { SocketService } from './services/socketService/socket.service';
import { AuthService } from './services/authentication/auth.service';
import { ForceLogoutService } from './services/supervisorService/forceLogoutService.service';
import { GenerateBeneficiaryID } from './services/generateBeneficiaryService/generateBenIDservice.service';

//interaction service
import { InteractionService } from './services/interaction-service/interaction.service';

//report service
import { ReportService } from './reports/report-services/report.service';

//config

import { InnerQuestionTypeDetailComponent } from './question-type-detail/question-type-detail.component';
import { InnerQuestionTypeConfigurationComponent } from './question-type-configuration/question-type-configuration.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { LoaderComponent } from './loader/loader.component';
import { InnerKnowledgeManagementComponent } from './knowledge-management/knowledge-management.component';
import { SupervisorNotificationsComponent } from './supervisor-notifications/supervisor-notifications.component';

import { InnerpageAgentCongenitalAnomalies } from './agent-congenitalanomalies/agent-congenitalanomalies.component';
import { NewMctsCallConfigurationComponent } from './new-mcts-call-configuration/new-mcts-call-configuration.component';
import { EditCallConfigComponent } from './edit-call-config/edit-call-config.component';
import { AddQuestionaireComponent } from './add-questionaire/add-questionaire.component';
import { EditQuestionaireComponent } from './edit-questionaire/edit-questionaire.component';
import {DeleteMultipleComponent} from './question-type-configuration/question-type-configuration.component';
import { CallStatisticsComponent } from './call-statistics/call-statistics.component';
import { CallQComponent } from './call-q/call-q.component';
import { CongenitalHistoryComponent } from './congenital-history/congenital-history.component';
import { SmsDialogComponent } from './sms-dialog/sms-dialog.component';
import { ComplaintDialogComponent } from './complaint-dialog/complaint-dialog.component';
import { ViewComplaintsComponent } from './view-complaints/view-complaints.component';

import { ForceLogoutComponent } from './force-logout/force-logout.component';

//reports

import { ComplaintReportsComponent } from './reports/complaint-reports/complaint-reports.component';
import { DataReportsComponent } from './reports/data-reports/data-reports.component';

//communication
import { SupervisorEmergencyContactsComponent } from './supervisor-emergency-contacts/supervisor-emergency-contacts.component';
import { SupervisorTrainingResourcesComponent } from './supervisor-training-resources/supervisor-training-resources.component';
import { SupervisorAlertsNotificationsComponent } from './supervisor-alerts-notifications/supervisor-alerts-notifications.component';
import { SupervisorLocationCommunicationComponent } from './supervisor-location-communication/supervisor-location-communication.component';

import { DashboardReportsComponent } from './dashboard-reports/dashboard-reports.component';

import { AlertsNotificationsDialogComponent } from './alerts-notifications/alerts-notifications.component';
import { EditBeneficiaryComponent } from './edit-beneficiary/edit-beneficiary.component';

import { GenerateBenificiaryIDComponent } from './generate-benificiary-id/generate-benificiary-id.component';
import { InterationConfigurationComponent } from './interaction/interation-configuration/interation-configuration.component';
import { CreateInteractionComponent } from './interaction/create-interaction/create-interaction.component';
import { EditInteractionComponent } from './interaction/edit-interaction/edit-interaction.component';

import { MedicalHistoryDialogComponent } from './medical-history-dialog/medical-history-dialog.component';
import { MmuHistoryComponent } from './mmu-history/mmu-history.component';
import { MmuHistoryCasesheetComponent } from './mmu-history/mmu-history-casesheet/mmu-history-casesheet.component';
import { ChangeLogComponent } from './change-log/change-log.component';

import { QualityAuditComponent } from './quality-audit/quality-audit.component';
import { CaseSheetSummaryDialogComponent } from './quality-audit/quality-audit.component';
import { SupervisorReportsComponent } from './supervisor-reports/supervisor-reports.component';
import { AgentStatusComponent } from './agent-status/agent-status.component';
import { EmergencyContactsViewModalComponent } from './emergency-contacts-view-modal/emergency-contacts-view-modal.component';
import { CallSummaryReportsComponent } from './reports/call-summary-reports/call-summary-reports.component';
import { CallDetailsReportComponent } from './reports/call-details-report/call-details-report.component';
import { DialPreferenceComponent } from './dial-preference/dial-preference.component';
import { NhmReportsComponent } from './reports/nhm-reports/nhm-reports.component';
import { CallsAnsweredReportComponent } from './reports/calls-answered-report/calls-answered-report.component';
import { CallsNotAnsweredReportComponent } from './reports/calls-not-answered-report/calls-not-answered-report.component';
import { AgentForceLogoutComponent } from './agent-force-logout/agent-force-logout.component';
import { QualityAuditService } from './services/supervisorService/quality-audit-service.service';
import { HighRiskReportsComponent } from './reports/high-risk-reports/high-risk-reports.component';
import { CongenitalAnomaliesReportComponent } from './reports/congenital-anomalies-report/congenital-anomalies-report.component';
import { ValidRecordsReportComponent } from './reports/valid-records-report/valid-records-report.component';
import { InvalidRecordsReportComponent } from './reports/invalid-records-report/invalid-records-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';
import { CallDetailsUniqueReportComponent } from './reports/call-details-unique-report/call-details-unique-report.component';
import { AllowMinDirective } from './directives/allow-min/allow-min.directive';

import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { SmsTemplateService } from './services/supervisorService/sms-template-service.service';
import { CommonSmsDialogComponent } from './common-sms-dialog/common-sms-dialog.component';

import { CallCountService } from './services/call-count-service/call-count.service';

// mmu case sheet components
import { CancerCaseSheetComponent } from './mmu-history/mmu-history-casesheet/cancer-case-sheet/cancer-case-sheet.component';
import { CancerDoctorDiagnosisCaseSheetComponent } from './mmu-history/mmu-history-casesheet/cancer-case-sheet/cancer-doctor-diagnosis-case-sheet/cancer-doctor-diagnosis-case-sheet.component';
import { CancerExaminationCaseSheetComponent } from './mmu-history/mmu-history-casesheet/cancer-case-sheet/cancer-examination-case-sheet/cancer-examination-case-sheet.component';
import { CancerHistoryCaseSheetComponent } from './mmu-history/mmu-history-casesheet/cancer-case-sheet/cancer-history-case-sheet/cancer-history-case-sheet.component';
import { ImageToCanvasComponent } from './mmu-history/mmu-history-casesheet/cancer-case-sheet/image-to-canvas/image-to-canvas.component';

import { GeneralCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/general-case-sheet.component';
import { AncCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/anc-case-sheet/anc-case-sheet.component';
import { DoctorDiagnosisCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/doctor-diagnosis-case-sheet/doctor-diagnosis-case-sheet.component';
import { ExaminationCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/examination-case-sheet/examination-case-sheet.component';
import { HistoryCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/history-case-sheet/history-case-sheet.component';
import { PncCaseSheetComponent } from './mmu-history/mmu-history-casesheet/general-case-sheet/pnc-case-sheet/pnc-case-sheet.component';
import { MapQuestionaireComponent } from './map-questionaire/map-questionaire.component';

import { DatePipe } from '@angular/common';
import { SetLanguageComponent } from './set-language.component';
import { StringValidator } from './directives/stringValidator.directive';
import { myAddress } from './directives/address/myAddress.directive';
import { AnswerValidatorDirective } from './directives/answer/answerValidator.directive';
import { BloodBankUrlValidatorDirective } from './directives/bloodBank/bloodBankUrlValidator.directive';
import { InputFieldValidatorDirective } from './directives/inputField/inputField.directive';
import { QuestionnaireValidatorDirective } from './directives/question/questionnaire.directive';
import { SearchIdValidatorDirective } from './directives/searchId/searchIdValidator.directive';
import { SmsTemplateValidatorDirective } from './directives/smsTemplate/smsTemplateValidator.directive';
import { TextareaDirective } from './directives/textarea/textarea.directive';
import { UsernameValidatorDirective } from './directives/username/usernameValidator.directive';
import { SmsTemplateValidatorDirectiveWithCopyPaste } from './directives/smsTemplate/smsTemplateValidatorWithcopypaste.directive';


@NgModule({
  declarations: [
    AppComponent, dashboardContentClass, loginContentClass,
    ResetComponent, myPassword, InnerpageComponent, MultiRoleScreenComponent,
    DashboardRowHeaderComponent, DashboardNavigationComponent,
    DashboardUserIdComponent, ActivityThisWeekComponent,
    AlertsNotificationComponent, DailyTasksComponent, NewsInformationsComponent,
    RatingComponent, WeatherWarningsComponent,
    myName, myMobileNumber, myEmail, ServiceRoleSelectionComponent, UpdatesFromBeneficiaryComponent, SetSecurityQuestionsComponent,
    MyDatePickerDirective, SetLanguageComponent,

    MctsAgentOutbondcallComponent, OutbondCallWorklistComponent, AgentSearchRecordsComponent,
    OutbondCallWorklistComponent, AgentSearchRecordsComponent,
    AgentAllocateRecordsComponent, OutbondCallHistoryComponent, OutbondCallDocSelfNoComponent,
    OutbondCallHistoryComponent, OutbondCallDocSelfNoComponent,
    UploadexcelComponent, ReallocationCallAgentComponent,
    InnerQuestionerModalComponent, InnerClosureOutbondcallComponent,
    InnerMctsCallConfiguration, InnerQuestionTypeDetailComponent, InnerQuestionTypeConfigurationComponent,
    MessageDialogComponent, LoaderComponent, InnerKnowledgeManagementComponent, SupervisorNotificationsComponent,
    InnerpageAgentCongenitalAnomalies, NotificationsDialogComponent, EditNotificationsComponent, NewMctsCallConfigurationComponent,
    EditCallConfigComponent, AddQuestionaireComponent, EditQuestionaireComponent, TrainingResourcesComponent, SetPasswordComponent,
    CallStatisticsComponent, CallQComponent, CongenitalHistoryComponent,
    CommonDialogComponent, SmsDialogComponent, ComplaintDialogComponent,
    ViewComplaintsComponent, OrderByPipe, UtcDatePipe,
    SupervisorEmergencyContactsComponent, SupervisorTrainingResourcesComponent,
    SupervisorLocationCommunicationComponent, SupervisorAlertsNotificationsComponent,
    DashboardReportsComponent,
    AlertsNotificationsDialogComponent,
    EditBeneficiaryComponent,
    GenerateBenificiaryIDComponent,
    ForceLogoutComponent,
    InterationConfigurationComponent,
    CreateInteractionComponent,
    EditInteractionComponent,
    MedicalHistoryDialogComponent,
    MmuHistoryComponent,
    MmuHistoryCasesheetComponent,
    ChangeLogComponent, EmergencyContactsViewModalComponent,
    QualityAuditComponent,
    CaseSheetSummaryDialogComponent,
    SupervisorReportsComponent,
    AgentStatusComponent,
    ComplaintReportsComponent,
    DataReportsComponent,
    CallSummaryReportsComponent,
    CallDetailsReportComponent,
    DialPreferenceComponent,
    NhmReportsComponent,
    CallsAnsweredReportComponent,
    CallsNotAnsweredReportComponent,
    AgentForceLogoutComponent,
    HighRiskReportsComponent,
    CongenitalAnomaliesReportComponent,
    ValidRecordsReportComponent,
    InvalidRecordsReportComponent,
    DailyReportComponent,
    CallDetailsUniqueReportComponent,
    AllowMinDirective,
    SmsTemplateComponent,
    CommonSmsDialogComponent,
    CancerCaseSheetComponent,
    CancerDoctorDiagnosisCaseSheetComponent,
    CancerExaminationCaseSheetComponent,
    CancerHistoryCaseSheetComponent,
    ImageToCanvasComponent,
    GeneralCaseSheetComponent,
    AncCaseSheetComponent,
    DoctorDiagnosisCaseSheetComponent,
    ExaminationCaseSheetComponent,
    HistoryCaseSheetComponent,
    PncCaseSheetComponent,
    ViewVersionDetailsComponent,
    MapQuestionaireComponent,DeleteMultipleComponent,
    StringValidator,myAddress,AnswerValidatorDirective,
    BloodBankUrlValidatorDirective, myEmail, InputFieldValidatorDirective,
    myMobileNumber, QuestionnaireValidatorDirective, SearchIdValidatorDirective,
    SmsTemplateValidatorDirective,SmsTemplateValidatorDirectiveWithCopyPaste, TextareaDirective, UsernameValidatorDirective
  ],
  

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Md2Module,
    MdCardModule,
    MdRadioModule,
    MdCheckboxModule,
    ToasterModule,
    RouterModule.forRoot([
      {
        path: 'resetPassword',
        component: ResetComponent
      },
      {
        path: '',
        component: loginContentClass
      },
      {
        path: 'InnerpageComponent',
        component: InnerpageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'setQuestions',
        component: SetSecurityQuestionsComponent
      },
      {
        path: 'outboundCallWorklist',
        component: MctsAgentOutbondcallComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'outboundCallWorklist/:phoneNo/:callerID',
        component: MctsAgentOutbondcallComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'quetsionConfig',
        component: InnerQuestionTypeConfigurationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'setPassword',
        component: SetPasswordComponent
      },
      {
        path: 'MultiRoleScreenComponent',
        component: MultiRoleScreenComponent,
        children: [
          {
            path: '',
            component: ServiceRoleSelectionComponent,
            outlet: 'postLogin_router',
            //  canActivate: [AuthGuard]

          },
          {
            path: 'dashboard',
            component: dashboardContentClass,
            outlet: 'postLogin_router',
            canActivate: [AuthGuard]

          }
        ]
      },
      {
        path: '',
        redirectTo: '/loginContentClass',
        pathMatch: 'full'
      }
    ])],
  providers: [loginService, dataService, RegisterService, HttpServices, ACAService, OCWService,
    KnowledgeManagementService, CzentrixServices, AgentSearchRecordService, OCWService,
    AgentSearchRecordService, UploadexcelService, CallAllocationService, QuestionTypeService,
    ConfigService, NotificationService, QuestionaireService, CallClosureService, LoaderService,
    ConfirmationDialogsService, DashboardHttpServices, SocketService, AuthService, ReportService,
    ForceLogoutService, GenerateBeneficiaryID, InteractionService, AuthGuard, SaveFormsGuard,
    QualityAuditService, SmsTemplateService, CallCountService,DatePipe,
    {

      provide: InterceptedHttp,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LoaderService, Router, AuthService, ConfirmationDialogsService, SocketService]
    },
    {
      provide: SecurityInterceptedHttp,
      useFactory: SecurityFactory,
      deps: [XHRBackend, RequestOptions, Router, AuthService, ConfirmationDialogsService, SocketService]
    }],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialogComponent, LoaderComponent, NotificationsDialogComponent, EmergencyContactsViewModalComponent,
    EditNotificationsComponent, NewMctsCallConfigurationComponent, EditCallConfigComponent,
    AddQuestionaireComponent, InnerQuestionerModalComponent, EditQuestionaireComponent,DeleteMultipleComponent,
    CallQComponent, CongenitalHistoryComponent, CommonDialogComponent,
    SmsDialogComponent, ComplaintDialogComponent, ViewComplaintsComponent,
    AlertsNotificationsDialogComponent, EditBeneficiaryComponent, GenerateBenificiaryIDComponent, CreateInteractionComponent,
    EditInteractionComponent, MmuHistoryComponent, MmuHistoryCasesheetComponent, ChangeLogComponent, AgentForceLogoutComponent,
    // CaseSheetSummaryDialogComponent,
    CommonSmsDialogComponent, ViewVersionDetailsComponent,MapQuestionaireComponent
  ]
})
export class AppModule { }



