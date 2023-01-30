import {OnSeederInit, Seeder} from "nestjs-sequelize-seeder";

import {Role} from "../roles.model";


@Seeder({
    // @ts-ignore
    model: Role,
    unique: ["value"]
})
export class SeedRole implements OnSeederInit {
    run() {
        return [
            {
                value: "ADMIN",
                description: "You're GOD in the app",
                isDestroyable: false,
            }, {
                value: "USER",
                description: "You're nothing in the app",
                isDestroyable: false,
            }
        ];
    }
}