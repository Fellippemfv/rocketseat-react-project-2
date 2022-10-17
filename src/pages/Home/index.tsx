import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownContainer,
    TaskInput,
} from "./styles";

const newCycleFormValidtionSchema = zod.object({
    task: zod.string().min(1, "Informe  a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "O clico precisa ser de no minimo 5 minutos")
        .max(60, "o ciclo precisar ser de no maximo 60 minutos"),
});

/* interface NewCycleFormData {
    task: string;
    minutesAmount: number;
} */

type NewCycleFormData = zod.infer<typeof newCycleFormValidtionSchema>;

export function Home() {
    const { register, handleSubmit, watch } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidtionSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        console.log(data);
    }

    const task = watch("task");
    const isSubmitDisable = !task;
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        {...register("task")}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto1" />
                        <option value="Projeto2" />
                        <option value="Projeto3" />
                        <option value="Projeto4" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register("minutesAmount", { valueAsNumber: true })}
                    />

                    <span>minutos</span>
                </FormContainer>
                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownContainer
                    disabled={isSubmitDisable}
                    type="submit"
                >
                    <Play size={24} />
                    Começar
                </StartCountdownContainer>
            </form>
        </HomeContainer>
    );
}
