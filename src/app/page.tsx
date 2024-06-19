"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Reviews from "@/messages.json";
import { Mail } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <div className="bg-white w-full h-[85vh] flex flex-col justify-center items-center p-3">
      <div className="text-[#283618] text-center space-y-3">
        <h1 className="md:text-5xl text-3xl font-bold">
          Empower Honest Feedback, Anonymously and Safely
        </h1>
        <p className="md:text-2xl text-1xl font-bold">
          Pure Feedback - Confidential Insights, Real Change.
        </p>
      </div>
      <div className="w-full mt-12">
        <div className="m-auto max-w-[600px] w-full">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent>
              {Reviews.map((message) => {
                return (
                  <CarouselItem key={message.content}>
                    <Card className="rounded-xl bg-slate-50 py-3">
                      <CardHeader>
                        <div className="w-full flex justify-between items-center">
                          <CardTitle>{message.name}</CardTitle>
                        </div>
                        <CardDescription className="text-gray-500 text-base flex gap-2 mt-2 items-center">
                          <Mail /> {message.content}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
