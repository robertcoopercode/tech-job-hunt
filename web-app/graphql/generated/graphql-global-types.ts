/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  DECIDED = "DECIDED",
  INTERESTED = "INTERESTED",
  INTERVIEWING = "INTERVIEWING",
  OFFER = "OFFER",
}

export enum BillingFrequency {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum JobDecision {
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  REJECTED = "REJECTED",
}

export enum OrderByArg {
  asc = "asc",
  desc = "desc",
}

export interface AwsFileDataCreateManyWithoutResumeInput {
  connect?: AwsFileDataWhereUniqueInput[] | null;
  create?: AwsFileDataCreateWithoutResumeInput[] | null;
}

export interface AwsFileDataCreateOneWithoutCompanyInput {
  connect?: AwsFileDataWhereUniqueInput | null;
  create?: AwsFileDataCreateWithoutCompanyInput | null;
}

export interface AwsFileDataCreateOneWithoutJobApplicationInput {
  connect?: AwsFileDataWhereUniqueInput | null;
  create?: AwsFileDataCreateWithoutJobApplicationInput | null;
}

export interface AwsFileDataCreateWithoutCompanyInput {
  Bucket: string;
  cloudfrontUrl: string;
  createdAt?: any | null;
  ETag: string;
  fileName: string;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutCoverLetterFileInput | null;
  Key: string;
  Location: string;
  Resume?: ResumeCreateManyWithoutVersionsInput | null;
  s3Url: string;
  VersionId: string;
}

export interface AwsFileDataCreateWithoutJobApplicationInput {
  Bucket: string;
  cloudfrontUrl: string;
  Company?: CompanyCreateManyWithoutImageInput | null;
  createdAt?: any | null;
  ETag: string;
  fileName: string;
  id?: string | null;
  Key: string;
  Location: string;
  Resume?: ResumeCreateManyWithoutVersionsInput | null;
  s3Url: string;
  VersionId: string;
}

export interface AwsFileDataCreateWithoutResumeInput {
  Bucket: string;
  cloudfrontUrl: string;
  Company?: CompanyCreateManyWithoutImageInput | null;
  createdAt?: any | null;
  ETag: string;
  fileName: string;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutCoverLetterFileInput | null;
  Key: string;
  Location: string;
  s3Url: string;
  VersionId: string;
}

export interface AwsFileDataFilter {
  every?: AwsFileDataWhereInput | null;
  none?: AwsFileDataWhereInput | null;
  some?: AwsFileDataWhereInput | null;
}

export interface AwsFileDataScalarWhereInput {
  AND?: AwsFileDataScalarWhereInput[] | null;
  Bucket?: StringFilter | null;
  cloudfrontUrl?: StringFilter | null;
  Company?: CompanyFilter | null;
  createdAt?: DateTimeFilter | null;
  ETag?: StringFilter | null;
  fileName?: StringFilter | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  Key?: StringFilter | null;
  Location?: StringFilter | null;
  NOT?: AwsFileDataScalarWhereInput[] | null;
  OR?: AwsFileDataScalarWhereInput[] | null;
  Resume?: ResumeFilter | null;
  s3Url?: StringFilter | null;
  VersionId?: StringFilter | null;
}

export interface AwsFileDataUpdateManyDataInput {
  Bucket?: string | null;
  cloudfrontUrl?: string | null;
  createdAt?: any | null;
  ETag?: string | null;
  fileName?: string | null;
  id?: string | null;
  Key?: string | null;
  Location?: string | null;
  s3Url?: string | null;
  VersionId?: string | null;
}

export interface AwsFileDataUpdateManyWithWhereNestedInput {
  data: AwsFileDataUpdateManyDataInput;
  where: AwsFileDataScalarWhereInput;
}

export interface AwsFileDataUpdateManyWithoutResumeInput {
  connect?: AwsFileDataWhereUniqueInput[] | null;
  create?: AwsFileDataCreateWithoutResumeInput[] | null;
  delete?: AwsFileDataWhereUniqueInput[] | null;
  deleteMany?: AwsFileDataScalarWhereInput[] | null;
  disconnect?: AwsFileDataWhereUniqueInput[] | null;
  set?: AwsFileDataWhereUniqueInput[] | null;
  update?: AwsFileDataUpdateWithWhereUniqueWithoutResumeInput[] | null;
  updateMany?: AwsFileDataUpdateManyWithWhereNestedInput[] | null;
  upsert?: AwsFileDataUpsertWithWhereUniqueWithoutResumeInput[] | null;
}

export interface AwsFileDataUpdateOneWithoutCompanyInput {
  connect?: AwsFileDataWhereUniqueInput | null;
  create?: AwsFileDataCreateWithoutCompanyInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: AwsFileDataUpdateWithoutCompanyDataInput | null;
  upsert?: AwsFileDataUpsertWithoutCompanyInput | null;
}

export interface AwsFileDataUpdateOneWithoutJobApplicationInput {
  connect?: AwsFileDataWhereUniqueInput | null;
  create?: AwsFileDataCreateWithoutJobApplicationInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: AwsFileDataUpdateWithoutJobApplicationDataInput | null;
  upsert?: AwsFileDataUpsertWithoutJobApplicationInput | null;
}

export interface AwsFileDataUpdateWithWhereUniqueWithoutResumeInput {
  data: AwsFileDataUpdateWithoutResumeDataInput;
  where: AwsFileDataWhereUniqueInput;
}

export interface AwsFileDataUpdateWithoutCompanyDataInput {
  Bucket?: string | null;
  cloudfrontUrl?: string | null;
  createdAt?: any | null;
  ETag?: string | null;
  fileName?: string | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutCoverLetterFileInput | null;
  Key?: string | null;
  Location?: string | null;
  Resume?: ResumeUpdateManyWithoutVersionsInput | null;
  s3Url?: string | null;
  VersionId?: string | null;
}

export interface AwsFileDataUpdateWithoutJobApplicationDataInput {
  Bucket?: string | null;
  cloudfrontUrl?: string | null;
  Company?: CompanyUpdateManyWithoutImageInput | null;
  createdAt?: any | null;
  ETag?: string | null;
  fileName?: string | null;
  id?: string | null;
  Key?: string | null;
  Location?: string | null;
  Resume?: ResumeUpdateManyWithoutVersionsInput | null;
  s3Url?: string | null;
  VersionId?: string | null;
}

export interface AwsFileDataUpdateWithoutResumeDataInput {
  Bucket?: string | null;
  cloudfrontUrl?: string | null;
  Company?: CompanyUpdateManyWithoutImageInput | null;
  createdAt?: any | null;
  ETag?: string | null;
  fileName?: string | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutCoverLetterFileInput | null;
  Key?: string | null;
  Location?: string | null;
  s3Url?: string | null;
  VersionId?: string | null;
}

export interface AwsFileDataUpsertWithWhereUniqueWithoutResumeInput {
  create: AwsFileDataCreateWithoutResumeInput;
  update: AwsFileDataUpdateWithoutResumeDataInput;
  where: AwsFileDataWhereUniqueInput;
}

export interface AwsFileDataUpsertWithoutCompanyInput {
  create: AwsFileDataCreateWithoutCompanyInput;
  update: AwsFileDataUpdateWithoutCompanyDataInput;
}

export interface AwsFileDataUpsertWithoutJobApplicationInput {
  create: AwsFileDataCreateWithoutJobApplicationInput;
  update: AwsFileDataUpdateWithoutJobApplicationDataInput;
}

export interface AwsFileDataWhereInput {
  AND?: AwsFileDataWhereInput[] | null;
  Bucket?: StringFilter | null;
  cloudfrontUrl?: StringFilter | null;
  Company?: CompanyFilter | null;
  createdAt?: DateTimeFilter | null;
  ETag?: StringFilter | null;
  fileName?: StringFilter | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  Key?: StringFilter | null;
  Location?: StringFilter | null;
  NOT?: AwsFileDataWhereInput[] | null;
  OR?: AwsFileDataWhereInput[] | null;
  Resume?: ResumeFilter | null;
  s3Url?: StringFilter | null;
  VersionId?: StringFilter | null;
}

export interface AwsFileDataWhereUniqueInput {
  id?: string | null;
}

export interface BillingInfoCreateOneWithoutUserInput {
  connect?: BillingInfoWhereUniqueInput | null;
  create?: BillingInfoCreateWithoutUserInput | null;
}

export interface BillingInfoCreateWithoutCardInput {
  billingFrequency?: BillingFrequency | null;
  endOfBillingPeriod?: number | null;
  id?: string | null;
  isPremiumActive?: boolean | null;
  startOfBillingPeriod?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  User?: UserCreateManyWithoutBillingInput | null;
  willCancelAtEndOfPeriod?: boolean | null;
}

export interface BillingInfoCreateWithoutUserInput {
  billingFrequency?: BillingFrequency | null;
  Card?: CardCreateOneWithoutBillingInfoInput | null;
  endOfBillingPeriod?: number | null;
  id?: string | null;
  isPremiumActive?: boolean | null;
  startOfBillingPeriod?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  willCancelAtEndOfPeriod?: boolean | null;
}

export interface BillingInfoFilter {
  every?: BillingInfoWhereInput | null;
  none?: BillingInfoWhereInput | null;
  some?: BillingInfoWhereInput | null;
}

export interface BillingInfoScalarWhereInput {
  AND?: BillingInfoScalarWhereInput[] | null;
  billingFrequency?: BillingFrequency | null;
  card?: NullableStringFilter | null;
  endOfBillingPeriod?: NullableIntFilter | null;
  id?: StringFilter | null;
  isPremiumActive?: BooleanFilter | null;
  NOT?: BillingInfoScalarWhereInput[] | null;
  OR?: BillingInfoScalarWhereInput[] | null;
  startOfBillingPeriod?: NullableIntFilter | null;
  stripeCustomerId?: NullableStringFilter | null;
  stripeSubscriptionId?: NullableStringFilter | null;
  User?: UserFilter | null;
  willCancelAtEndOfPeriod?: BooleanFilter | null;
}

export interface BillingInfoUpdateManyDataInput {
  billingFrequency?: BillingFrequency | null;
  endOfBillingPeriod?: number | null;
  id?: string | null;
  isPremiumActive?: boolean | null;
  startOfBillingPeriod?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  willCancelAtEndOfPeriod?: boolean | null;
}

export interface BillingInfoUpdateManyWithWhereNestedInput {
  data: BillingInfoUpdateManyDataInput;
  where: BillingInfoScalarWhereInput;
}

export interface BillingInfoUpdateManyWithoutCardInput {
  connect?: BillingInfoWhereUniqueInput[] | null;
  create?: BillingInfoCreateWithoutCardInput[] | null;
  delete?: BillingInfoWhereUniqueInput[] | null;
  deleteMany?: BillingInfoScalarWhereInput[] | null;
  disconnect?: BillingInfoWhereUniqueInput[] | null;
  set?: BillingInfoWhereUniqueInput[] | null;
  update?: BillingInfoUpdateWithWhereUniqueWithoutCardInput[] | null;
  updateMany?: BillingInfoUpdateManyWithWhereNestedInput[] | null;
  upsert?: BillingInfoUpsertWithWhereUniqueWithoutCardInput[] | null;
}

export interface BillingInfoUpdateOneWithoutUserInput {
  connect?: BillingInfoWhereUniqueInput | null;
  create?: BillingInfoCreateWithoutUserInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: BillingInfoUpdateWithoutUserDataInput | null;
  upsert?: BillingInfoUpsertWithoutUserInput | null;
}

export interface BillingInfoUpdateWithWhereUniqueWithoutCardInput {
  data: BillingInfoUpdateWithoutCardDataInput;
  where: BillingInfoWhereUniqueInput;
}

export interface BillingInfoUpdateWithoutCardDataInput {
  billingFrequency?: BillingFrequency | null;
  endOfBillingPeriod?: number | null;
  id?: string | null;
  isPremiumActive?: boolean | null;
  startOfBillingPeriod?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  User?: UserUpdateManyWithoutBillingInput | null;
  willCancelAtEndOfPeriod?: boolean | null;
}

export interface BillingInfoUpdateWithoutUserDataInput {
  billingFrequency?: BillingFrequency | null;
  Card?: CardUpdateOneWithoutBillingInfoInput | null;
  endOfBillingPeriod?: number | null;
  id?: string | null;
  isPremiumActive?: boolean | null;
  startOfBillingPeriod?: number | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  willCancelAtEndOfPeriod?: boolean | null;
}

export interface BillingInfoUpsertWithWhereUniqueWithoutCardInput {
  create: BillingInfoCreateWithoutCardInput;
  update: BillingInfoUpdateWithoutCardDataInput;
  where: BillingInfoWhereUniqueInput;
}

export interface BillingInfoUpsertWithoutUserInput {
  create: BillingInfoCreateWithoutUserInput;
  update: BillingInfoUpdateWithoutUserDataInput;
}

export interface BillingInfoWhereInput {
  AND?: BillingInfoWhereInput[] | null;
  billingFrequency?: BillingFrequency | null;
  card?: NullableStringFilter | null;
  Card?: CardWhereInput | null;
  endOfBillingPeriod?: NullableIntFilter | null;
  id?: StringFilter | null;
  isPremiumActive?: BooleanFilter | null;
  NOT?: BillingInfoWhereInput[] | null;
  OR?: BillingInfoWhereInput[] | null;
  startOfBillingPeriod?: NullableIntFilter | null;
  stripeCustomerId?: NullableStringFilter | null;
  stripeSubscriptionId?: NullableStringFilter | null;
  User?: UserFilter | null;
  willCancelAtEndOfPeriod?: BooleanFilter | null;
}

export interface BillingInfoWhereUniqueInput {
  id?: string | null;
  stripeCustomerId?: string | null;
}

export interface BooleanFilter {
  equals?: boolean | null;
  not?: boolean | null;
}

export interface CardCreateOneWithoutBillingInfoInput {
  connect?: CardWhereUniqueInput | null;
  create?: CardCreateWithoutBillingInfoInput | null;
}

export interface CardCreateWithoutBillingInfoInput {
  brand: string;
  expMonth: number;
  expYear: number;
  id?: string | null;
  last4Digits: string;
  stripePaymentMethodId: string;
}

export interface CardUpdateInput {
  BillingInfo?: BillingInfoUpdateManyWithoutCardInput | null;
  brand?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
  id?: string | null;
  last4Digits?: string | null;
  stripePaymentMethodId?: string | null;
}

export interface CardUpdateOneWithoutBillingInfoInput {
  connect?: CardWhereUniqueInput | null;
  create?: CardCreateWithoutBillingInfoInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: CardUpdateWithoutBillingInfoDataInput | null;
  upsert?: CardUpsertWithoutBillingInfoInput | null;
}

export interface CardUpdateWithoutBillingInfoDataInput {
  brand?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
  id?: string | null;
  last4Digits?: string | null;
  stripePaymentMethodId?: string | null;
}

export interface CardUpsertWithoutBillingInfoInput {
  create: CardCreateWithoutBillingInfoInput;
  update: CardUpdateWithoutBillingInfoDataInput;
}

export interface CardWhereInput {
  AND?: CardWhereInput[] | null;
  BillingInfo?: BillingInfoFilter | null;
  brand?: StringFilter | null;
  expMonth?: IntFilter | null;
  expYear?: IntFilter | null;
  id?: StringFilter | null;
  last4Digits?: StringFilter | null;
  NOT?: CardWhereInput[] | null;
  OR?: CardWhereInput[] | null;
  stripePaymentMethodId?: StringFilter | null;
}

export interface CardWhereUniqueInput {
  id?: string | null;
}

export interface CompanyContactCreateManyWithoutCompanyInput {
  connect?: CompanyContactWhereUniqueInput[] | null;
  create?: CompanyContactCreateWithoutCompanyInput[] | null;
}

export interface CompanyContactCreateWithoutCompanyInput {
  email?: string | null;
  id?: string | null;
  name: string;
  notes?: string | null;
  order: number;
  phone?: string | null;
  position?: string | null;
}

export interface CompanyContactFilter {
  every?: CompanyContactWhereInput | null;
  none?: CompanyContactWhereInput | null;
  some?: CompanyContactWhereInput | null;
}

export interface CompanyContactScalarWhereInput {
  AND?: CompanyContactScalarWhereInput[] | null;
  company?: NullableStringFilter | null;
  email?: NullableStringFilter | null;
  id?: StringFilter | null;
  name?: StringFilter | null;
  NOT?: CompanyContactScalarWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: CompanyContactScalarWhereInput[] | null;
  order?: IntFilter | null;
  phone?: NullableStringFilter | null;
  position?: NullableStringFilter | null;
}

export interface CompanyContactUpdateManyDataInput {
  email?: string | null;
  id?: string | null;
  name?: string | null;
  notes?: string | null;
  order?: number | null;
  phone?: string | null;
  position?: string | null;
}

export interface CompanyContactUpdateManyWithWhereNestedInput {
  data: CompanyContactUpdateManyDataInput;
  where: CompanyContactScalarWhereInput;
}

export interface CompanyContactUpdateManyWithoutCompanyInput {
  connect?: CompanyContactWhereUniqueInput[] | null;
  create?: CompanyContactCreateWithoutCompanyInput[] | null;
  delete?: CompanyContactWhereUniqueInput[] | null;
  deleteMany?: CompanyContactScalarWhereInput[] | null;
  disconnect?: CompanyContactWhereUniqueInput[] | null;
  set?: CompanyContactWhereUniqueInput[] | null;
  update?: CompanyContactUpdateWithWhereUniqueWithoutCompanyInput[] | null;
  updateMany?: CompanyContactUpdateManyWithWhereNestedInput[] | null;
  upsert?: CompanyContactUpsertWithWhereUniqueWithoutCompanyInput[] | null;
}

export interface CompanyContactUpdateWithWhereUniqueWithoutCompanyInput {
  data: CompanyContactUpdateWithoutCompanyDataInput;
  where: CompanyContactWhereUniqueInput;
}

export interface CompanyContactUpdateWithoutCompanyDataInput {
  email?: string | null;
  id?: string | null;
  name?: string | null;
  notes?: string | null;
  order?: number | null;
  phone?: string | null;
  position?: string | null;
}

export interface CompanyContactUpsertWithWhereUniqueWithoutCompanyInput {
  create: CompanyContactCreateWithoutCompanyInput;
  update: CompanyContactUpdateWithoutCompanyDataInput;
  where: CompanyContactWhereUniqueInput;
}

export interface CompanyContactWhereInput {
  AND?: CompanyContactWhereInput[] | null;
  company?: NullableStringFilter | null;
  Company?: CompanyWhereInput | null;
  email?: NullableStringFilter | null;
  id?: StringFilter | null;
  name?: StringFilter | null;
  NOT?: CompanyContactWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: CompanyContactWhereInput[] | null;
  order?: IntFilter | null;
  phone?: NullableStringFilter | null;
  position?: NullableStringFilter | null;
}

export interface CompanyContactWhereUniqueInput {
  id?: string | null;
}

export interface CompanyCreateManyWithoutImageInput {
  connect?: CompanyWhereUniqueInput[] | null;
  create?: CompanyCreateWithoutImageInput[] | null;
}

export interface CompanyCreateManyWithoutUserInput {
  connect?: CompanyWhereUniqueInput[] | null;
  create?: CompanyCreateWithoutUserInput[] | null;
}

export interface CompanyCreateOneWithoutJobApplicationInput {
  connect?: CompanyWhereUniqueInput | null;
  create?: CompanyCreateWithoutJobApplicationInput | null;
}

export interface CompanyCreateWithoutImageInput {
  Contacts?: CompanyContactCreateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name: string;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutCompanyInput | null;
  website?: string | null;
}

export interface CompanyCreateWithoutJobApplicationInput {
  Contacts?: CompanyContactCreateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  Image?: AwsFileDataCreateOneWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name: string;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutCompanyInput | null;
  website?: string | null;
}

export interface CompanyCreateWithoutUserInput {
  Contacts?: CompanyContactCreateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  Image?: AwsFileDataCreateOneWithoutCompanyInput | null;
  JobApplication?: JobApplicationCreateManyWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name: string;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  website?: string | null;
}

export interface CompanyFilter {
  every?: CompanyWhereInput | null;
  none?: CompanyWhereInput | null;
  some?: CompanyWhereInput | null;
}

export interface CompanyScalarWhereInput {
  AND?: CompanyScalarWhereInput[] | null;
  Contacts?: CompanyContactFilter | null;
  createdAt?: DateTimeFilter | null;
  id?: StringFilter | null;
  image?: NullableStringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  jobApplicationsCount?: IntFilter | null;
  name?: StringFilter | null;
  NOT?: CompanyScalarWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: CompanyScalarWhereInput[] | null;
  rating?: NullableIntFilter | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
  website?: NullableStringFilter | null;
}

export interface CompanyUpdateManyDataInput {
  createdAt?: any | null;
  id?: string | null;
  jobApplicationsCount?: number | null;
  name?: string | null;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  website?: string | null;
}

export interface CompanyUpdateManyWithWhereNestedInput {
  data: CompanyUpdateManyDataInput;
  where: CompanyScalarWhereInput;
}

export interface CompanyUpdateManyWithoutImageInput {
  connect?: CompanyWhereUniqueInput[] | null;
  create?: CompanyCreateWithoutImageInput[] | null;
  delete?: CompanyWhereUniqueInput[] | null;
  deleteMany?: CompanyScalarWhereInput[] | null;
  disconnect?: CompanyWhereUniqueInput[] | null;
  set?: CompanyWhereUniqueInput[] | null;
  update?: CompanyUpdateWithWhereUniqueWithoutImageInput[] | null;
  updateMany?: CompanyUpdateManyWithWhereNestedInput[] | null;
  upsert?: CompanyUpsertWithWhereUniqueWithoutImageInput[] | null;
}

export interface CompanyUpdateManyWithoutUserInput {
  connect?: CompanyWhereUniqueInput[] | null;
  create?: CompanyCreateWithoutUserInput[] | null;
  delete?: CompanyWhereUniqueInput[] | null;
  deleteMany?: CompanyScalarWhereInput[] | null;
  disconnect?: CompanyWhereUniqueInput[] | null;
  set?: CompanyWhereUniqueInput[] | null;
  update?: CompanyUpdateWithWhereUniqueWithoutUserInput[] | null;
  updateMany?: CompanyUpdateManyWithWhereNestedInput[] | null;
  upsert?: CompanyUpsertWithWhereUniqueWithoutUserInput[] | null;
}

export interface CompanyUpdateOneWithoutJobApplicationInput {
  connect?: CompanyWhereUniqueInput | null;
  create?: CompanyCreateWithoutJobApplicationInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: CompanyUpdateWithoutJobApplicationDataInput | null;
  upsert?: CompanyUpsertWithoutJobApplicationInput | null;
}

export interface CompanyUpdateWithWhereUniqueWithoutImageInput {
  data: CompanyUpdateWithoutImageDataInput;
  where: CompanyWhereUniqueInput;
}

export interface CompanyUpdateWithWhereUniqueWithoutUserInput {
  data: CompanyUpdateWithoutUserDataInput;
  where: CompanyWhereUniqueInput;
}

export interface CompanyUpdateWithoutImageDataInput {
  Contacts?: CompanyContactUpdateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name?: string | null;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutCompanyInput | null;
  website?: string | null;
}

export interface CompanyUpdateWithoutJobApplicationDataInput {
  Contacts?: CompanyContactUpdateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  Image?: AwsFileDataUpdateOneWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name?: string | null;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutCompanyInput | null;
  website?: string | null;
}

export interface CompanyUpdateWithoutUserDataInput {
  Contacts?: CompanyContactUpdateManyWithoutCompanyInput | null;
  createdAt?: any | null;
  id?: string | null;
  Image?: AwsFileDataUpdateOneWithoutCompanyInput | null;
  JobApplication?: JobApplicationUpdateManyWithoutCompanyInput | null;
  jobApplicationsCount?: number | null;
  name?: string | null;
  notes?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  website?: string | null;
}

export interface CompanyUpsertWithWhereUniqueWithoutImageInput {
  create: CompanyCreateWithoutImageInput;
  update: CompanyUpdateWithoutImageDataInput;
  where: CompanyWhereUniqueInput;
}

export interface CompanyUpsertWithWhereUniqueWithoutUserInput {
  create: CompanyCreateWithoutUserInput;
  update: CompanyUpdateWithoutUserDataInput;
  where: CompanyWhereUniqueInput;
}

export interface CompanyUpsertWithoutJobApplicationInput {
  create: CompanyCreateWithoutJobApplicationInput;
  update: CompanyUpdateWithoutJobApplicationDataInput;
}

export interface CompanyWhereInput {
  AND?: CompanyWhereInput[] | null;
  Contacts?: CompanyContactFilter | null;
  createdAt?: DateTimeFilter | null;
  id?: StringFilter | null;
  image?: NullableStringFilter | null;
  Image?: AwsFileDataWhereInput | null;
  JobApplication?: JobApplicationFilter | null;
  jobApplicationsCount?: IntFilter | null;
  name?: StringFilter | null;
  NOT?: CompanyWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: CompanyWhereInput[] | null;
  rating?: NullableIntFilter | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
  User?: UserWhereInput | null;
  website?: NullableStringFilter | null;
}

export interface CompanyWhereUniqueInput {
  id?: string | null;
}

export interface DateTimeFilter {
  equals?: any | null;
  gt?: any | null;
  gte?: any | null;
  in?: any[] | null;
  lt?: any | null;
  lte?: any | null;
  not?: any | null;
  notIn?: any[] | null;
}

export interface GoogleMapsLocationCreateOneWithoutJobApplicationInput {
  connect?: GoogleMapsLocationWhereUniqueInput | null;
  create?: GoogleMapsLocationCreateWithoutJobApplicationInput | null;
}

export interface GoogleMapsLocationCreateWithoutJobApplicationInput {
  googlePlacesId: string;
  id?: string | null;
  name: string;
}

export interface GoogleMapsLocationUpdateInput {
  googlePlacesId?: string | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutLocationInput | null;
  name?: string | null;
}

export interface GoogleMapsLocationUpdateOneWithoutJobApplicationInput {
  connect?: GoogleMapsLocationWhereUniqueInput | null;
  create?: GoogleMapsLocationCreateWithoutJobApplicationInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: GoogleMapsLocationUpdateWithoutJobApplicationDataInput | null;
  upsert?: GoogleMapsLocationUpsertWithoutJobApplicationInput | null;
}

export interface GoogleMapsLocationUpdateWithoutJobApplicationDataInput {
  googlePlacesId?: string | null;
  id?: string | null;
  name?: string | null;
}

export interface GoogleMapsLocationUpsertWithoutJobApplicationInput {
  create: GoogleMapsLocationCreateWithoutJobApplicationInput;
  update: GoogleMapsLocationUpdateWithoutJobApplicationDataInput;
}

export interface GoogleMapsLocationWhereInput {
  AND?: GoogleMapsLocationWhereInput[] | null;
  googlePlacesId?: StringFilter | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  name?: StringFilter | null;
  NOT?: GoogleMapsLocationWhereInput[] | null;
  OR?: GoogleMapsLocationWhereInput[] | null;
}

export interface GoogleMapsLocationWhereUniqueInput {
  id?: string | null;
}

export interface IntFilter {
  equals?: number | null;
  gt?: number | null;
  gte?: number | null;
  in?: number[] | null;
  lt?: number | null;
  lte?: number | null;
  not?: number | null;
  notIn?: number[] | null;
}

export interface JobApplicationContactCreateManyWithoutJobApplicationInput {
  connect?: JobApplicationContactWhereUniqueInput[] | null;
  create?: JobApplicationContactCreateWithoutJobApplicationInput[] | null;
}

export interface JobApplicationContactCreateWithoutJobApplicationInput {
  email?: string | null;
  id?: string | null;
  name: string;
  notes?: string | null;
  order: number;
  phone?: string | null;
  position?: string | null;
}

export interface JobApplicationContactFilter {
  every?: JobApplicationContactWhereInput | null;
  none?: JobApplicationContactWhereInput | null;
  some?: JobApplicationContactWhereInput | null;
}

export interface JobApplicationContactScalarWhereInput {
  AND?: JobApplicationContactScalarWhereInput[] | null;
  email?: NullableStringFilter | null;
  id?: StringFilter | null;
  jobApplication?: NullableStringFilter | null;
  name?: StringFilter | null;
  NOT?: JobApplicationContactScalarWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: JobApplicationContactScalarWhereInput[] | null;
  order?: IntFilter | null;
  phone?: NullableStringFilter | null;
  position?: NullableStringFilter | null;
}

export interface JobApplicationContactUpdateManyDataInput {
  email?: string | null;
  id?: string | null;
  name?: string | null;
  notes?: string | null;
  order?: number | null;
  phone?: string | null;
  position?: string | null;
}

export interface JobApplicationContactUpdateManyWithWhereNestedInput {
  data: JobApplicationContactUpdateManyDataInput;
  where: JobApplicationContactScalarWhereInput;
}

export interface JobApplicationContactUpdateManyWithoutJobApplicationInput {
  connect?: JobApplicationContactWhereUniqueInput[] | null;
  create?: JobApplicationContactCreateWithoutJobApplicationInput[] | null;
  delete?: JobApplicationContactWhereUniqueInput[] | null;
  deleteMany?: JobApplicationContactScalarWhereInput[] | null;
  disconnect?: JobApplicationContactWhereUniqueInput[] | null;
  set?: JobApplicationContactWhereUniqueInput[] | null;
  update?: JobApplicationContactUpdateWithWhereUniqueWithoutJobApplicationInput[] | null;
  updateMany?: JobApplicationContactUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationContactUpsertWithWhereUniqueWithoutJobApplicationInput[] | null;
}

export interface JobApplicationContactUpdateWithWhereUniqueWithoutJobApplicationInput {
  data: JobApplicationContactUpdateWithoutJobApplicationDataInput;
  where: JobApplicationContactWhereUniqueInput;
}

export interface JobApplicationContactUpdateWithoutJobApplicationDataInput {
  email?: string | null;
  id?: string | null;
  name?: string | null;
  notes?: string | null;
  order?: number | null;
  phone?: string | null;
  position?: string | null;
}

export interface JobApplicationContactUpsertWithWhereUniqueWithoutJobApplicationInput {
  create: JobApplicationContactCreateWithoutJobApplicationInput;
  update: JobApplicationContactUpdateWithoutJobApplicationDataInput;
  where: JobApplicationContactWhereUniqueInput;
}

export interface JobApplicationContactWhereInput {
  AND?: JobApplicationContactWhereInput[] | null;
  email?: NullableStringFilter | null;
  id?: StringFilter | null;
  jobApplication?: NullableStringFilter | null;
  JobApplication?: JobApplicationWhereInput | null;
  name?: StringFilter | null;
  NOT?: JobApplicationContactWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: JobApplicationContactWhereInput[] | null;
  order?: IntFilter | null;
  phone?: NullableStringFilter | null;
  position?: NullableStringFilter | null;
}

export interface JobApplicationContactWhereUniqueInput {
  id?: string | null;
}

export interface JobApplicationCreateManyWithoutCompanyInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutCompanyInput[] | null;
}

export interface JobApplicationCreateManyWithoutCoverLetterFileInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutCoverLetterFileInput[] | null;
}

export interface JobApplicationCreateManyWithoutResumeInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutResumeInput[] | null;
}

export interface JobApplicationCreateManyWithoutUserInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutUserInput[] | null;
}

export interface JobApplicationCreateWithoutCompanyInput {
  applicationStatus?: ApplicationStatus | null;
  companyName: string;
  Contacts?: JobApplicationContactCreateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataCreateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote: boolean;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationCreateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position: string;
  rating?: number | null;
  Resume?: JobApplicationResumeCreateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationCreateWithoutCoverLetterFileInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyCreateOneWithoutJobApplicationInput | null;
  companyName: string;
  Contacts?: JobApplicationContactCreateManyWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote: boolean;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationCreateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position: string;
  rating?: number | null;
  Resume?: JobApplicationResumeCreateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationCreateWithoutLocationInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyCreateOneWithoutJobApplicationInput | null;
  companyName: string;
  Contacts?: JobApplicationContactCreateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataCreateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote: boolean;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  locationName?: string | null;
  notes?: string | null;
  position: string;
  rating?: number | null;
  Resume?: JobApplicationResumeCreateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationCreateWithoutResumeInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyCreateOneWithoutJobApplicationInput | null;
  companyName: string;
  Contacts?: JobApplicationContactCreateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataCreateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote: boolean;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationCreateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position: string;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationCreateWithoutUserInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyCreateOneWithoutJobApplicationInput | null;
  companyName: string;
  Contacts?: JobApplicationContactCreateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataCreateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote: boolean;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationCreateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position: string;
  rating?: number | null;
  Resume?: JobApplicationResumeCreateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
}

export interface JobApplicationFilter {
  every?: JobApplicationWhereInput | null;
  none?: JobApplicationWhereInput | null;
  some?: JobApplicationWhereInput | null;
}

export interface JobApplicationResumeCreateManyWithoutResumeInput {
  connect?: JobApplicationResumeWhereUniqueInput[] | null;
  create?: JobApplicationResumeCreateWithoutResumeInput[] | null;
}

export interface JobApplicationResumeCreateOneWithoutJobApplicationInput {
  connect?: JobApplicationResumeWhereUniqueInput | null;
  create?: JobApplicationResumeCreateWithoutJobApplicationInput | null;
}

export interface JobApplicationResumeCreateWithoutJobApplicationInput {
  id?: string | null;
  Resume?: ResumeCreateOneWithoutJobApplicationResumeInput | null;
  selectedVersionId: string;
}

export interface JobApplicationResumeCreateWithoutResumeInput {
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutResumeInput | null;
  selectedVersionId: string;
}

export interface JobApplicationResumeFilter {
  every?: JobApplicationResumeWhereInput | null;
  none?: JobApplicationResumeWhereInput | null;
  some?: JobApplicationResumeWhereInput | null;
}

export interface JobApplicationResumeScalarWhereInput {
  AND?: JobApplicationResumeScalarWhereInput[] | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  NOT?: JobApplicationResumeScalarWhereInput[] | null;
  OR?: JobApplicationResumeScalarWhereInput[] | null;
  resume?: NullableStringFilter | null;
  selectedVersionId?: StringFilter | null;
}

export interface JobApplicationResumeUpdateManyDataInput {
  id?: string | null;
  selectedVersionId?: string | null;
}

export interface JobApplicationResumeUpdateManyWithWhereNestedInput {
  data: JobApplicationResumeUpdateManyDataInput;
  where: JobApplicationResumeScalarWhereInput;
}

export interface JobApplicationResumeUpdateManyWithoutResumeInput {
  connect?: JobApplicationResumeWhereUniqueInput[] | null;
  create?: JobApplicationResumeCreateWithoutResumeInput[] | null;
  delete?: JobApplicationResumeWhereUniqueInput[] | null;
  deleteMany?: JobApplicationResumeScalarWhereInput[] | null;
  disconnect?: JobApplicationResumeWhereUniqueInput[] | null;
  set?: JobApplicationResumeWhereUniqueInput[] | null;
  update?: JobApplicationResumeUpdateWithWhereUniqueWithoutResumeInput[] | null;
  updateMany?: JobApplicationResumeUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationResumeUpsertWithWhereUniqueWithoutResumeInput[] | null;
}

export interface JobApplicationResumeUpdateOneWithoutJobApplicationInput {
  connect?: JobApplicationResumeWhereUniqueInput | null;
  create?: JobApplicationResumeCreateWithoutJobApplicationInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: JobApplicationResumeUpdateWithoutJobApplicationDataInput | null;
  upsert?: JobApplicationResumeUpsertWithoutJobApplicationInput | null;
}

export interface JobApplicationResumeUpdateWithWhereUniqueWithoutResumeInput {
  data: JobApplicationResumeUpdateWithoutResumeDataInput;
  where: JobApplicationResumeWhereUniqueInput;
}

export interface JobApplicationResumeUpdateWithoutJobApplicationDataInput {
  id?: string | null;
  Resume?: ResumeUpdateOneWithoutJobApplicationResumeInput | null;
  selectedVersionId?: string | null;
}

export interface JobApplicationResumeUpdateWithoutResumeDataInput {
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutResumeInput | null;
  selectedVersionId?: string | null;
}

export interface JobApplicationResumeUpsertWithWhereUniqueWithoutResumeInput {
  create: JobApplicationResumeCreateWithoutResumeInput;
  update: JobApplicationResumeUpdateWithoutResumeDataInput;
  where: JobApplicationResumeWhereUniqueInput;
}

export interface JobApplicationResumeUpsertWithoutJobApplicationInput {
  create: JobApplicationResumeCreateWithoutJobApplicationInput;
  update: JobApplicationResumeUpdateWithoutJobApplicationDataInput;
}

export interface JobApplicationResumeWhereInput {
  AND?: JobApplicationResumeWhereInput[] | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  NOT?: JobApplicationResumeWhereInput[] | null;
  OR?: JobApplicationResumeWhereInput[] | null;
  resume?: NullableStringFilter | null;
  Resume?: ResumeWhereInput | null;
  selectedVersionId?: StringFilter | null;
}

export interface JobApplicationResumeWhereUniqueInput {
  id?: string | null;
}

export interface JobApplicationScalarWhereInput {
  AND?: JobApplicationScalarWhereInput[] | null;
  applicationStatus?: ApplicationStatus | null;
  company?: NullableStringFilter | null;
  companyName?: StringFilter | null;
  Contacts?: JobApplicationContactFilter | null;
  coverLetterFile?: NullableStringFilter | null;
  createdAt?: DateTimeFilter | null;
  dateApplied?: NullableDateTimeFilter | null;
  dateDecided?: NullableDateTimeFilter | null;
  dateOffered?: NullableDateTimeFilter | null;
  id?: StringFilter | null;
  isApplicationActive?: BooleanFilter | null;
  isRemote?: BooleanFilter | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingFilter | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: NullableStringFilter | null;
  jobListingNotes?: NullableStringFilter | null;
  location?: NullableStringFilter | null;
  locationName?: NullableStringFilter | null;
  NOT?: JobApplicationScalarWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: JobApplicationScalarWhereInput[] | null;
  position?: StringFilter | null;
  rating?: NullableIntFilter | null;
  resume?: NullableStringFilter | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
}

export interface JobApplicationUpdateManyDataInput {
  applicationStatus?: ApplicationStatus | null;
  companyName?: string | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
}

export interface JobApplicationUpdateManyWithWhereNestedInput {
  data: JobApplicationUpdateManyDataInput;
  where: JobApplicationScalarWhereInput;
}

export interface JobApplicationUpdateManyWithoutCompanyInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutCompanyInput[] | null;
  delete?: JobApplicationWhereUniqueInput[] | null;
  deleteMany?: JobApplicationScalarWhereInput[] | null;
  disconnect?: JobApplicationWhereUniqueInput[] | null;
  set?: JobApplicationWhereUniqueInput[] | null;
  update?: JobApplicationUpdateWithWhereUniqueWithoutCompanyInput[] | null;
  updateMany?: JobApplicationUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationUpsertWithWhereUniqueWithoutCompanyInput[] | null;
}

export interface JobApplicationUpdateManyWithoutCoverLetterFileInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutCoverLetterFileInput[] | null;
  delete?: JobApplicationWhereUniqueInput[] | null;
  deleteMany?: JobApplicationScalarWhereInput[] | null;
  disconnect?: JobApplicationWhereUniqueInput[] | null;
  set?: JobApplicationWhereUniqueInput[] | null;
  update?: JobApplicationUpdateWithWhereUniqueWithoutCoverLetterFileInput[] | null;
  updateMany?: JobApplicationUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationUpsertWithWhereUniqueWithoutCoverLetterFileInput[] | null;
}

export interface JobApplicationUpdateManyWithoutLocationInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutLocationInput[] | null;
  delete?: JobApplicationWhereUniqueInput[] | null;
  deleteMany?: JobApplicationScalarWhereInput[] | null;
  disconnect?: JobApplicationWhereUniqueInput[] | null;
  set?: JobApplicationWhereUniqueInput[] | null;
  update?: JobApplicationUpdateWithWhereUniqueWithoutLocationInput[] | null;
  updateMany?: JobApplicationUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationUpsertWithWhereUniqueWithoutLocationInput[] | null;
}

export interface JobApplicationUpdateManyWithoutResumeInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutResumeInput[] | null;
  delete?: JobApplicationWhereUniqueInput[] | null;
  deleteMany?: JobApplicationScalarWhereInput[] | null;
  disconnect?: JobApplicationWhereUniqueInput[] | null;
  set?: JobApplicationWhereUniqueInput[] | null;
  update?: JobApplicationUpdateWithWhereUniqueWithoutResumeInput[] | null;
  updateMany?: JobApplicationUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationUpsertWithWhereUniqueWithoutResumeInput[] | null;
}

export interface JobApplicationUpdateManyWithoutUserInput {
  connect?: JobApplicationWhereUniqueInput[] | null;
  create?: JobApplicationCreateWithoutUserInput[] | null;
  delete?: JobApplicationWhereUniqueInput[] | null;
  deleteMany?: JobApplicationScalarWhereInput[] | null;
  disconnect?: JobApplicationWhereUniqueInput[] | null;
  set?: JobApplicationWhereUniqueInput[] | null;
  update?: JobApplicationUpdateWithWhereUniqueWithoutUserInput[] | null;
  updateMany?: JobApplicationUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplicationUpsertWithWhereUniqueWithoutUserInput[] | null;
}

export interface JobApplicationUpdateWithWhereUniqueWithoutCompanyInput {
  data: JobApplicationUpdateWithoutCompanyDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpdateWithWhereUniqueWithoutCoverLetterFileInput {
  data: JobApplicationUpdateWithoutCoverLetterFileDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpdateWithWhereUniqueWithoutLocationInput {
  data: JobApplicationUpdateWithoutLocationDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpdateWithWhereUniqueWithoutResumeInput {
  data: JobApplicationUpdateWithoutResumeDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpdateWithWhereUniqueWithoutUserInput {
  data: JobApplicationUpdateWithoutUserDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpdateWithoutCompanyDataInput {
  applicationStatus?: ApplicationStatus | null;
  companyName?: string | null;
  Contacts?: JobApplicationContactUpdateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataUpdateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationUpdateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  Resume?: JobApplicationResumeUpdateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationUpdateWithoutCoverLetterFileDataInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyUpdateOneWithoutJobApplicationInput | null;
  companyName?: string | null;
  Contacts?: JobApplicationContactUpdateManyWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationUpdateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  Resume?: JobApplicationResumeUpdateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationUpdateWithoutLocationDataInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyUpdateOneWithoutJobApplicationInput | null;
  companyName?: string | null;
  Contacts?: JobApplicationContactUpdateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataUpdateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  Resume?: JobApplicationResumeUpdateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationUpdateWithoutResumeDataInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyUpdateOneWithoutJobApplicationInput | null;
  companyName?: string | null;
  Contacts?: JobApplicationContactUpdateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataUpdateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationUpdateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutJobApplicationInput | null;
}

export interface JobApplicationUpdateWithoutUserDataInput {
  applicationStatus?: ApplicationStatus | null;
  Company?: CompanyUpdateOneWithoutJobApplicationInput | null;
  companyName?: string | null;
  Contacts?: JobApplicationContactUpdateManyWithoutJobApplicationInput | null;
  CoverLetterFile?: AwsFileDataUpdateOneWithoutJobApplicationInput | null;
  createdAt?: any | null;
  dateApplied?: any | null;
  dateDecided?: any | null;
  dateOffered?: any | null;
  id?: string | null;
  isApplicationActive?: boolean | null;
  isRemote?: boolean | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: string | null;
  jobListingNotes?: string | null;
  Location?: GoogleMapsLocationUpdateOneWithoutJobApplicationInput | null;
  locationName?: string | null;
  notes?: string | null;
  position?: string | null;
  rating?: number | null;
  Resume?: JobApplicationResumeUpdateOneWithoutJobApplicationInput | null;
  updatedAt?: any | null;
}

export interface JobApplicationUpsertWithWhereUniqueWithoutCompanyInput {
  create: JobApplicationCreateWithoutCompanyInput;
  update: JobApplicationUpdateWithoutCompanyDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpsertWithWhereUniqueWithoutCoverLetterFileInput {
  create: JobApplicationCreateWithoutCoverLetterFileInput;
  update: JobApplicationUpdateWithoutCoverLetterFileDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpsertWithWhereUniqueWithoutLocationInput {
  create: JobApplicationCreateWithoutLocationInput;
  update: JobApplicationUpdateWithoutLocationDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpsertWithWhereUniqueWithoutResumeInput {
  create: JobApplicationCreateWithoutResumeInput;
  update: JobApplicationUpdateWithoutResumeDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationUpsertWithWhereUniqueWithoutUserInput {
  create: JobApplicationCreateWithoutUserInput;
  update: JobApplicationUpdateWithoutUserDataInput;
  where: JobApplicationWhereUniqueInput;
}

export interface JobApplicationWhereInput {
  AND?: JobApplicationWhereInput[] | null;
  applicationStatus?: ApplicationStatus | null;
  company?: NullableStringFilter | null;
  Company?: CompanyWhereInput | null;
  companyName?: StringFilter | null;
  Contacts?: JobApplicationContactFilter | null;
  coverLetterFile?: NullableStringFilter | null;
  CoverLetterFile?: AwsFileDataWhereInput | null;
  createdAt?: DateTimeFilter | null;
  dateApplied?: NullableDateTimeFilter | null;
  dateDecided?: NullableDateTimeFilter | null;
  dateOffered?: NullableDateTimeFilter | null;
  id?: StringFilter | null;
  isApplicationActive?: BooleanFilter | null;
  isRemote?: BooleanFilter | null;
  JobApplication_dateInterviewing?: JobApplication_dateInterviewingFilter | null;
  jobDecision?: JobDecision | null;
  jobListingLink?: NullableStringFilter | null;
  jobListingNotes?: NullableStringFilter | null;
  location?: NullableStringFilter | null;
  Location?: GoogleMapsLocationWhereInput | null;
  locationName?: NullableStringFilter | null;
  NOT?: JobApplicationWhereInput[] | null;
  notes?: NullableStringFilter | null;
  OR?: JobApplicationWhereInput[] | null;
  position?: StringFilter | null;
  rating?: NullableIntFilter | null;
  resume?: NullableStringFilter | null;
  Resume?: JobApplicationResumeWhereInput | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
  User?: UserWhereInput | null;
}

export interface JobApplicationWhereUniqueInput {
  id?: string | null;
}

export interface JobApplication_dateInterviewingCreateManyWithoutJobApplicationInput {
  connect?: JobApplication_dateInterviewingWhereUniqueInput[] | null;
  create?: JobApplication_dateInterviewingCreateWithoutJobApplicationInput[] | null;
}

export interface JobApplication_dateInterviewingCreateWithoutJobApplicationInput {
  position: number;
  value: any;
}

export interface JobApplication_dateInterviewingFilter {
  every?: JobApplication_dateInterviewingWhereInput | null;
  none?: JobApplication_dateInterviewingWhereInput | null;
  some?: JobApplication_dateInterviewingWhereInput | null;
}

export interface JobApplication_dateInterviewingScalarWhereInput {
  AND?: JobApplication_dateInterviewingScalarWhereInput[] | null;
  nodeId?: StringFilter | null;
  NOT?: JobApplication_dateInterviewingScalarWhereInput[] | null;
  OR?: JobApplication_dateInterviewingScalarWhereInput[] | null;
  position?: IntFilter | null;
  value?: DateTimeFilter | null;
}

export interface JobApplication_dateInterviewingUpdateManyDataInput {
  position?: number | null;
  value?: any | null;
}

export interface JobApplication_dateInterviewingUpdateManyWithWhereNestedInput {
  data: JobApplication_dateInterviewingUpdateManyDataInput;
  where: JobApplication_dateInterviewingScalarWhereInput;
}

export interface JobApplication_dateInterviewingUpdateManyWithoutJobApplicationInput {
  connect?: JobApplication_dateInterviewingWhereUniqueInput[] | null;
  create?: JobApplication_dateInterviewingCreateWithoutJobApplicationInput[] | null;
  delete?: JobApplication_dateInterviewingWhereUniqueInput[] | null;
  deleteMany?: JobApplication_dateInterviewingScalarWhereInput[] | null;
  disconnect?: JobApplication_dateInterviewingWhereUniqueInput[] | null;
  set?: JobApplication_dateInterviewingWhereUniqueInput[] | null;
  update?: JobApplication_dateInterviewingUpdateWithWhereUniqueWithoutJobApplicationInput[] | null;
  updateMany?: JobApplication_dateInterviewingUpdateManyWithWhereNestedInput[] | null;
  upsert?: JobApplication_dateInterviewingUpsertWithWhereUniqueWithoutJobApplicationInput[] | null;
}

export interface JobApplication_dateInterviewingUpdateWithWhereUniqueWithoutJobApplicationInput {
  data: JobApplication_dateInterviewingUpdateWithoutJobApplicationDataInput;
  where: JobApplication_dateInterviewingWhereUniqueInput;
}

export interface JobApplication_dateInterviewingUpdateWithoutJobApplicationDataInput {
  position?: number | null;
  value?: any | null;
}

export interface JobApplication_dateInterviewingUpsertWithWhereUniqueWithoutJobApplicationInput {
  create: JobApplication_dateInterviewingCreateWithoutJobApplicationInput;
  update: JobApplication_dateInterviewingUpdateWithoutJobApplicationDataInput;
  where: JobApplication_dateInterviewingWhereUniqueInput;
}

export interface JobApplication_dateInterviewingWhereInput {
  AND?: JobApplication_dateInterviewingWhereInput[] | null;
  JobApplication?: JobApplicationWhereInput | null;
  nodeId?: StringFilter | null;
  NOT?: JobApplication_dateInterviewingWhereInput[] | null;
  OR?: JobApplication_dateInterviewingWhereInput[] | null;
  position?: IntFilter | null;
  value?: DateTimeFilter | null;
}

export interface JobApplication_dateInterviewingWhereUniqueInput {
  nodeId?: string | null;
}

export interface NullableBooleanFilter {
  equals?: boolean | null;
  not?: boolean | null;
}

export interface NullableDateTimeFilter {
  equals?: any | null;
  gt?: any | null;
  gte?: any | null;
  in?: any[] | null;
  lt?: any | null;
  lte?: any | null;
  not?: any | null;
  notIn?: any[] | null;
}

export interface NullableFloatFilter {
  equals?: number | null;
  gt?: number | null;
  gte?: number | null;
  in?: number[] | null;
  lt?: number | null;
  lte?: number | null;
  not?: number | null;
  notIn?: number[] | null;
}

export interface NullableIntFilter {
  equals?: number | null;
  gt?: number | null;
  gte?: number | null;
  in?: number[] | null;
  lt?: number | null;
  lte?: number | null;
  not?: number | null;
  notIn?: number[] | null;
}

export interface NullableStringFilter {
  contains?: string | null;
  endsWith?: string | null;
  equals?: string | null;
  gt?: string | null;
  gte?: string | null;
  in?: string[] | null;
  lt?: string | null;
  lte?: string | null;
  not?: string | null;
  notIn?: string[] | null;
  startsWith?: string | null;
}

export interface QueryCompaniesOrderByInput {
  jobApplicationsCount?: OrderByArg | null;
  name?: OrderByArg | null;
  updatedAt?: OrderByArg | null;
}

export interface QueryJobApplicationsOrderByInput {
  applicationStatus?: OrderByArg | null;
  companyName?: OrderByArg | null;
  locationName?: OrderByArg | null;
  position?: OrderByArg | null;
  updatedAt?: OrderByArg | null;
}

export interface QueryResumesOrderByInput {
  name?: OrderByArg | null;
  updatedAt?: OrderByArg | null;
}

export interface ResumeCreateManyWithoutUserInput {
  connect?: ResumeWhereUniqueInput[] | null;
  create?: ResumeCreateWithoutUserInput[] | null;
}

export interface ResumeCreateManyWithoutVersionsInput {
  connect?: ResumeWhereUniqueInput[] | null;
  create?: ResumeCreateWithoutVersionsInput[] | null;
}

export interface ResumeCreateOneWithoutJobApplicationResumeInput {
  connect?: ResumeWhereUniqueInput | null;
  create?: ResumeCreateWithoutJobApplicationResumeInput | null;
}

export interface ResumeCreateWithoutJobApplicationResumeInput {
  createdAt?: any | null;
  id?: string | null;
  name: string;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutResumeInput | null;
  Versions?: AwsFileDataCreateManyWithoutResumeInput | null;
}

export interface ResumeCreateWithoutUserInput {
  createdAt?: any | null;
  id?: string | null;
  JobApplicationResume?: JobApplicationResumeCreateManyWithoutResumeInput | null;
  name: string;
  updatedAt?: any | null;
  Versions?: AwsFileDataCreateManyWithoutResumeInput | null;
}

export interface ResumeCreateWithoutVersionsInput {
  createdAt?: any | null;
  id?: string | null;
  JobApplicationResume?: JobApplicationResumeCreateManyWithoutResumeInput | null;
  name: string;
  updatedAt?: any | null;
  User?: UserCreateOneWithoutResumeInput | null;
}

export interface ResumeFilter {
  every?: ResumeWhereInput | null;
  none?: ResumeWhereInput | null;
  some?: ResumeWhereInput | null;
}

export interface ResumeScalarWhereInput {
  AND?: ResumeScalarWhereInput[] | null;
  createdAt?: DateTimeFilter | null;
  id?: StringFilter | null;
  JobApplicationResume?: JobApplicationResumeFilter | null;
  name?: StringFilter | null;
  NOT?: ResumeScalarWhereInput[] | null;
  OR?: ResumeScalarWhereInput[] | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
  Versions?: AwsFileDataFilter | null;
}

export interface ResumeUpdateManyDataInput {
  createdAt?: any | null;
  id?: string | null;
  name?: string | null;
  updatedAt?: any | null;
}

export interface ResumeUpdateManyWithWhereNestedInput {
  data: ResumeUpdateManyDataInput;
  where: ResumeScalarWhereInput;
}

export interface ResumeUpdateManyWithoutUserInput {
  connect?: ResumeWhereUniqueInput[] | null;
  create?: ResumeCreateWithoutUserInput[] | null;
  delete?: ResumeWhereUniqueInput[] | null;
  deleteMany?: ResumeScalarWhereInput[] | null;
  disconnect?: ResumeWhereUniqueInput[] | null;
  set?: ResumeWhereUniqueInput[] | null;
  update?: ResumeUpdateWithWhereUniqueWithoutUserInput[] | null;
  updateMany?: ResumeUpdateManyWithWhereNestedInput[] | null;
  upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput[] | null;
}

export interface ResumeUpdateManyWithoutVersionsInput {
  connect?: ResumeWhereUniqueInput[] | null;
  create?: ResumeCreateWithoutVersionsInput[] | null;
  delete?: ResumeWhereUniqueInput[] | null;
  deleteMany?: ResumeScalarWhereInput[] | null;
  disconnect?: ResumeWhereUniqueInput[] | null;
  set?: ResumeWhereUniqueInput[] | null;
  update?: ResumeUpdateWithWhereUniqueWithoutVersionsInput[] | null;
  updateMany?: ResumeUpdateManyWithWhereNestedInput[] | null;
  upsert?: ResumeUpsertWithWhereUniqueWithoutVersionsInput[] | null;
}

export interface ResumeUpdateOneWithoutJobApplicationResumeInput {
  connect?: ResumeWhereUniqueInput | null;
  create?: ResumeCreateWithoutJobApplicationResumeInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: ResumeUpdateWithoutJobApplicationResumeDataInput | null;
  upsert?: ResumeUpsertWithoutJobApplicationResumeInput | null;
}

export interface ResumeUpdateWithWhereUniqueWithoutUserInput {
  data: ResumeUpdateWithoutUserDataInput;
  where: ResumeWhereUniqueInput;
}

export interface ResumeUpdateWithWhereUniqueWithoutVersionsInput {
  data: ResumeUpdateWithoutVersionsDataInput;
  where: ResumeWhereUniqueInput;
}

export interface ResumeUpdateWithoutJobApplicationResumeDataInput {
  createdAt?: any | null;
  id?: string | null;
  name?: string | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutResumeInput | null;
  Versions?: AwsFileDataUpdateManyWithoutResumeInput | null;
}

export interface ResumeUpdateWithoutUserDataInput {
  createdAt?: any | null;
  id?: string | null;
  JobApplicationResume?: JobApplicationResumeUpdateManyWithoutResumeInput | null;
  name?: string | null;
  updatedAt?: any | null;
  Versions?: AwsFileDataUpdateManyWithoutResumeInput | null;
}

export interface ResumeUpdateWithoutVersionsDataInput {
  createdAt?: any | null;
  id?: string | null;
  JobApplicationResume?: JobApplicationResumeUpdateManyWithoutResumeInput | null;
  name?: string | null;
  updatedAt?: any | null;
  User?: UserUpdateOneWithoutResumeInput | null;
}

export interface ResumeUpsertWithWhereUniqueWithoutUserInput {
  create: ResumeCreateWithoutUserInput;
  update: ResumeUpdateWithoutUserDataInput;
  where: ResumeWhereUniqueInput;
}

export interface ResumeUpsertWithWhereUniqueWithoutVersionsInput {
  create: ResumeCreateWithoutVersionsInput;
  update: ResumeUpdateWithoutVersionsDataInput;
  where: ResumeWhereUniqueInput;
}

export interface ResumeUpsertWithoutJobApplicationResumeInput {
  create: ResumeCreateWithoutJobApplicationResumeInput;
  update: ResumeUpdateWithoutJobApplicationResumeDataInput;
}

export interface ResumeWhereInput {
  AND?: ResumeWhereInput[] | null;
  createdAt?: DateTimeFilter | null;
  id?: StringFilter | null;
  JobApplicationResume?: JobApplicationResumeFilter | null;
  name?: StringFilter | null;
  NOT?: ResumeWhereInput[] | null;
  OR?: ResumeWhereInput[] | null;
  updatedAt?: DateTimeFilter | null;
  user?: NullableStringFilter | null;
  User?: UserWhereInput | null;
  Versions?: AwsFileDataFilter | null;
}

export interface ResumeWhereUniqueInput {
  id?: string | null;
}

export interface StringFilter {
  contains?: string | null;
  endsWith?: string | null;
  equals?: string | null;
  gt?: string | null;
  gte?: string | null;
  in?: string[] | null;
  lt?: string | null;
  lte?: string | null;
  not?: string | null;
  notIn?: string[] | null;
  startsWith?: string | null;
}

export interface UserCreateManyWithoutBillingInput {
  connect?: UserWhereUniqueInput[] | null;
  create?: UserCreateWithoutBillingInput[] | null;
}

export interface UserCreateOneWithoutCompanyInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutCompanyInput | null;
}

export interface UserCreateOneWithoutJobApplicationInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutJobApplicationInput | null;
}

export interface UserCreateOneWithoutResumeInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutResumeInput | null;
}

export interface UserCreateWithoutBillingInput {
  Company?: CompanyCreateManyWithoutUserInput | null;
  email: string;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeCreateManyWithoutUserInput | null;
}

export interface UserCreateWithoutCompanyInput {
  Billing?: BillingInfoCreateOneWithoutUserInput | null;
  email: string;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeCreateManyWithoutUserInput | null;
}

export interface UserCreateWithoutJobApplicationInput {
  Billing?: BillingInfoCreateOneWithoutUserInput | null;
  Company?: CompanyCreateManyWithoutUserInput | null;
  email: string;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeCreateManyWithoutUserInput | null;
}

export interface UserCreateWithoutResumeInput {
  Billing?: BillingInfoCreateOneWithoutUserInput | null;
  Company?: CompanyCreateManyWithoutUserInput | null;
  email: string;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationCreateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
}

export interface UserFilter {
  every?: UserWhereInput | null;
  none?: UserWhereInput | null;
  some?: UserWhereInput | null;
}

export interface UserScalarWhereInput {
  AND?: UserScalarWhereInput[] | null;
  billing?: NullableStringFilter | null;
  Company?: CompanyFilter | null;
  email?: StringFilter | null;
  emailConfirmationToken?: NullableStringFilter | null;
  googleId?: NullableStringFilter | null;
  hasCompletedOnboarding?: BooleanFilter | null;
  hasVerifiedEmail?: NullableBooleanFilter | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  NOT?: UserScalarWhereInput[] | null;
  OR?: UserScalarWhereInput[] | null;
  password?: NullableStringFilter | null;
  resetToken?: NullableStringFilter | null;
  resetTokenExpiry?: NullableFloatFilter | null;
  Resume?: ResumeFilter | null;
}

export interface UserUpdateManyDataInput {
  email?: string | null;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
}

export interface UserUpdateManyWithWhereNestedInput {
  data: UserUpdateManyDataInput;
  where: UserScalarWhereInput;
}

export interface UserUpdateManyWithoutBillingInput {
  connect?: UserWhereUniqueInput[] | null;
  create?: UserCreateWithoutBillingInput[] | null;
  delete?: UserWhereUniqueInput[] | null;
  deleteMany?: UserScalarWhereInput[] | null;
  disconnect?: UserWhereUniqueInput[] | null;
  set?: UserWhereUniqueInput[] | null;
  update?: UserUpdateWithWhereUniqueWithoutBillingInput[] | null;
  updateMany?: UserUpdateManyWithWhereNestedInput[] | null;
  upsert?: UserUpsertWithWhereUniqueWithoutBillingInput[] | null;
}

export interface UserUpdateOneWithoutCompanyInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutCompanyInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: UserUpdateWithoutCompanyDataInput | null;
  upsert?: UserUpsertWithoutCompanyInput | null;
}

export interface UserUpdateOneWithoutJobApplicationInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutJobApplicationInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: UserUpdateWithoutJobApplicationDataInput | null;
  upsert?: UserUpsertWithoutJobApplicationInput | null;
}

export interface UserUpdateOneWithoutResumeInput {
  connect?: UserWhereUniqueInput | null;
  create?: UserCreateWithoutResumeInput | null;
  delete?: boolean | null;
  disconnect?: boolean | null;
  update?: UserUpdateWithoutResumeDataInput | null;
  upsert?: UserUpsertWithoutResumeInput | null;
}

export interface UserUpdateWithWhereUniqueWithoutBillingInput {
  data: UserUpdateWithoutBillingDataInput;
  where: UserWhereUniqueInput;
}

export interface UserUpdateWithoutBillingDataInput {
  Company?: CompanyUpdateManyWithoutUserInput | null;
  email?: string | null;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeUpdateManyWithoutUserInput | null;
}

export interface UserUpdateWithoutCompanyDataInput {
  Billing?: BillingInfoUpdateOneWithoutUserInput | null;
  email?: string | null;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeUpdateManyWithoutUserInput | null;
}

export interface UserUpdateWithoutJobApplicationDataInput {
  Billing?: BillingInfoUpdateOneWithoutUserInput | null;
  Company?: CompanyUpdateManyWithoutUserInput | null;
  email?: string | null;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  Resume?: ResumeUpdateManyWithoutUserInput | null;
}

export interface UserUpdateWithoutResumeDataInput {
  Billing?: BillingInfoUpdateOneWithoutUserInput | null;
  Company?: CompanyUpdateManyWithoutUserInput | null;
  email?: string | null;
  emailConfirmationToken?: string | null;
  googleId?: string | null;
  hasCompletedOnboarding?: boolean | null;
  hasVerifiedEmail?: boolean | null;
  id?: string | null;
  JobApplication?: JobApplicationUpdateManyWithoutUserInput | null;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
}

export interface UserUpsertWithWhereUniqueWithoutBillingInput {
  create: UserCreateWithoutBillingInput;
  update: UserUpdateWithoutBillingDataInput;
  where: UserWhereUniqueInput;
}

export interface UserUpsertWithoutCompanyInput {
  create: UserCreateWithoutCompanyInput;
  update: UserUpdateWithoutCompanyDataInput;
}

export interface UserUpsertWithoutJobApplicationInput {
  create: UserCreateWithoutJobApplicationInput;
  update: UserUpdateWithoutJobApplicationDataInput;
}

export interface UserUpsertWithoutResumeInput {
  create: UserCreateWithoutResumeInput;
  update: UserUpdateWithoutResumeDataInput;
}

export interface UserWhereInput {
  AND?: UserWhereInput[] | null;
  billing?: NullableStringFilter | null;
  Billing?: BillingInfoWhereInput | null;
  Company?: CompanyFilter | null;
  email?: StringFilter | null;
  emailConfirmationToken?: NullableStringFilter | null;
  googleId?: NullableStringFilter | null;
  hasCompletedOnboarding?: BooleanFilter | null;
  hasVerifiedEmail?: NullableBooleanFilter | null;
  id?: StringFilter | null;
  JobApplication?: JobApplicationFilter | null;
  NOT?: UserWhereInput[] | null;
  OR?: UserWhereInput[] | null;
  password?: NullableStringFilter | null;
  resetToken?: NullableStringFilter | null;
  resetTokenExpiry?: NullableFloatFilter | null;
  Resume?: ResumeFilter | null;
}

export interface UserWhereUniqueInput {
  email?: string | null;
  googleId?: string | null;
  id?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
