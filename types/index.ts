export type EmergencyContact = { id:string; user_id:string; name:string; phone:string; relationship:string; created_at:string };
export type MedicalID = { user_id:string; blood_group:string|null; allergies:string|null; medical_conditions:string|null; updated_at:string };
export type SosEvent = { id:string; user_id:string; latitude:number|null; longitude:number|null; created_at:string; status:string };
