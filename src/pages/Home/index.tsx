import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createContext, useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

import {
    HomeContainer,
    StartCountdownContainer,
    StopCountdownContainer,
} from "./styles";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

import { useFormAction } from "react-router-dom";

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe  a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "O clico precisa ser de no minimo 5 minutos")
        .max(60, "o ciclo precisar ser de no maximo 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycledId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleAsFinished() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );
    }

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };
        setCycles((state) => [...state, newCycle]);
        setActiveCycledId(id);
        setAmountSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );
        setActiveCycledId(null);
    }

    const task = watch("task");
    const isSubmitDisable = !task;
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <CyclesContext.Provider
                    value={{
                        activeCycle,
                        activeCycleId,
                        markCurrentCycleAsFinished,
                        amountSecondsPassed,
                        setSecondsPassed,
                    }}
                >
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {activeCycle ? (
                    <StopCountdownContainer
                        onClick={handleInterruptCycle}
                        type="button"
                    >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownContainer>
                ) : (
                    <StartCountdownContainer
                        disabled={isSubmitDisable}
                        type="submit"
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownContainer>
                )}
            </form>
        </HomeContainer>
    );
}
