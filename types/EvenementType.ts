export type EvenementType = {
  Id_Evenement: number;
  Name: string;
  date: string;
  desc_: string;
  adresse: string;
  creation_date: string;
  Id_Category: number;
  Id_type_event: number;
};

export type UpdateEvenementType = {
  Name: string;
  date: string;
  desc_: string;
  adresse: string;
  Id_Category: number;
  Id_type_event: number;
};

export type ResultEvenementType = {
  Id_Evenement: number;
  Name: string;
  date: string;
  desc_: string;
  adresse: string;
  creation_date: string;
  Id_Category: number;
  Id_type_event: number;
  category_name: string;
  type_event_name: string;
};
