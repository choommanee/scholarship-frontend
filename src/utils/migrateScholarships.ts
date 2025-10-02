import { mahidolScholarships } from './scholarshipImport';
import { apiClient } from './api';

interface ScholarshipSource {
  source_id?: number;
  source_name: string;
  source_type: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

interface ScholarshipData {
  source_id: number;
  scholarship_name: string;
  scholarship_type: string;
  amount: number;
  total_quota: number;
  academic_year: string;
  semester?: string;
  eligibility_criteria?: string;
  required_documents?: string;
  application_start_date: string;
  application_end_date: string;
  interview_required: boolean;
}

/**
 * Creates a scholarship source in the database
 */
export async function createScholarshipSource(source: ScholarshipSource): Promise<number> {
  try {
    const response = await apiClient.post<{ source: ScholarshipSource }>('/scholarship-sources', source);
    return response.source.source_id || 0;
  } catch (error) {
    console.error('Failed to create scholarship source:', error);
    throw error;
  }
}

/**
 * Creates a scholarship in the database
 */
export async function createScholarship(scholarship: ScholarshipData): Promise<number> {
  try {
    const response = await apiClient.post<{ scholarship_id: number }>('/scholarships', scholarship);
    return response.scholarship_id;
  } catch (error) {
    console.error('Failed to create scholarship:', error);
    throw error;
  }
}

/**
 * Migrates mock scholarship data to the database
 */
export async function migrateScholarshipsToDatabase(): Promise<void> {
  try {
    // Create scholarship sources first
    // Convert Set to Array to avoid TypeScript iteration error
    const uniqueProviders = Array.from(new Set(mahidolScholarships.map(s => s.provider)));
    const sourceMap = new Map<string, number>();
    
    for (const provider of uniqueProviders) {
      // Check if source already exists
      try {
        const sources = await apiClient.get<{ sources: ScholarshipSource[] }>('/scholarship-sources', {
          params: { search: provider }
        });
        
        const existingSource = sources.sources.find(s => s.source_name === provider);
        if (existingSource && existingSource.source_id) {
          sourceMap.set(provider, existingSource.source_id);
          console.log(`Source already exists: ${provider} (ID: ${existingSource.source_id})`);
          continue;
        }
      } catch (error) {
        console.log(`No existing source found for: ${provider}, creating new one`);
      }
      
      // Create new source
      const sourceId = await createScholarshipSource({
        source_name: provider,
        source_type: 'university',
        description: `ทุนการศึกษาจาก ${provider}`
      });
      
      sourceMap.set(provider, sourceId);
      console.log(`Created source: ${provider} (ID: ${sourceId})`);
    }
    
    // Create scholarships
    for (const scholarship of mahidolScholarships) {
      const sourceId = sourceMap.get(scholarship.provider);
      if (!sourceId) {
        console.error(`Source ID not found for provider: ${scholarship.provider}`);
        continue;
      }
      
      // Format dates properly
      const createdDate = new Date(scholarship.createdDate);
      const deadlineDate = new Date(scholarship.applicationDeadline);
      
      // Convert requirements and documents to strings
      const eligibilityCriteria = scholarship.requirements.join('\n');
      const requiredDocuments = scholarship.documentsRequired.join('\n');
      
      const scholarshipData: ScholarshipData = {
        source_id: sourceId,
        scholarship_name: scholarship.name,
        scholarship_type: scholarship.type,
        amount: scholarship.amount,
        total_quota: scholarship.maxRecipients,
        academic_year: scholarship.academicYear,
        eligibility_criteria: eligibilityCriteria,
        required_documents: requiredDocuments,
        application_start_date: createdDate.toISOString(),
        application_end_date: deadlineDate.toISOString(),
        interview_required: false
      };
      
      try {
        const scholarshipId = await createScholarship(scholarshipData);
        console.log(`Created scholarship: ${scholarship.name} (ID: ${scholarshipId})`);
      } catch (error) {
        console.error(`Failed to create scholarship: ${scholarship.name}`, error);
      }
    }
    
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Utility function to run the migration from browser console or admin page
 */
export function runMigration() {
  migrateScholarshipsToDatabase()
    .then(() => console.log('Migration successful'))
    .catch(err => console.error('Migration failed:', err));
}
