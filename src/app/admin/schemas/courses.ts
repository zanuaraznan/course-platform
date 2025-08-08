import z from 'zod';

const courseSchema = z.object({
    name: z.string().nonempty('Required'),
    description: z.string().nonempty('Required'),
});

export { courseSchema };
