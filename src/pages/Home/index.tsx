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
import { string } from "zod";
import { useState } from "react";

const newCycleFormValidtionSchema = zod.object({
    task: zod.string().min(1, "Informe  a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "O clico precisa ser de no minimo 5 minutos")
        .max(60, "o ciclo precisar ser de no maximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidtionSchema>;

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycledId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidtionSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
        };
        setCycles((state) => [...state, newCycle]);
        setActiveCycledId(id);

        reset();
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, "0");
    const seconds = String(secondsAmount).padStart(2, "0");

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
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
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
