import { useQuery } from '@tanstack/react-query';
import { getProgramRequirementsQuery } from '../../api/query';
import { ProgramRequirementsTable } from '../../components/ProgramRequirementsTable/ProgramRequirementsTable';
import { convertDateUXFriendly } from '../../utils/contants';

export const ProgramRequirementsTableWrapper = ({ onAnalyseV2 }) => {
    const { data, isLoading } = useQuery(getProgramRequirementsQuery());
    if (isLoading) return <div>Loading...</div>;
    const transformedData =
        data?.data?.map((row) => {
            return {
                ...row, // Spread the original row object
                program_name: `${row.programId[0].school} ${row.programId[0].program_name} ${row.programId[0].degree}`,
                lang: `${row.programId[0].lang}`,
                degree: `${row.programId[0].degree}`,
                attributes: `${row.attributes.join('-')}`,
                country: `${row.programId[0].country}`,
                updatedAt: convertDateUXFriendly(row.updatedAt),
                id: row._id // Map MongoDB _id to id property
                // other properties...
            };
        }) || [];
    return (
        <ProgramRequirementsTable
            data={transformedData}
            onAnalyseV2={onAnalyseV2}
        />
    );
};
