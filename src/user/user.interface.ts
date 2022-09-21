export interface UserData {
	username: string;
	email: string;
	bio: string;
	image?: string;
};

export interface UserRO {
	user: UserData;
}

export interface UserDbData extends UserData {
	id: number;
	password: string;
}
