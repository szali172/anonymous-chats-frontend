export interface CreateGroupDto {
    name: string;
    startDate: Date;
    endDate: Date;
    userIds: string[];
}
