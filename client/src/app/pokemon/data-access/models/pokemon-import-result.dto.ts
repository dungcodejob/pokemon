export type PokemonImportResultDto = {
  id: string;
  fileName: string;
  originalName: string;
  importType: string;
  fileType: string;
  status: string;
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  createdAt: string;
  updatedAt: string;
};