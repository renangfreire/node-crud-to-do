export const schema = {
    tasks: {
        id: {type: "string", notNull: true},
        title: {type: "string", notNull: true},
        description: {type: "string", notNull: true},
        completed_at: {type: "string"},
        created_at: {type: "string", notNull: true},
        updated_at: {type: "string"}
    }
}