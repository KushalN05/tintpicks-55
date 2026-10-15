import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does TintPicks work?",
      answer: "TintPicks uses AI to analyze colors and suggest complementary palettes. You can capture colors with your camera, input hex codes, or explore our curated color collections to find perfect color combinations."
    },
    {
      question: "Can I save my favorite colors?",
      answer: "Yes! All your captured and saved colors are stored in your personal collection. You can access them anytime and use them to discover new color harmonies."
    },
    {
      question: "What types of color harmonies does TintPicks support?",
      answer: "TintPicks generates complementary, analogous, triadic, and monochromatic color schemes based on your selected colors, helping you create balanced and visually appealing palettes."
    },
    {
      question: "How accurate is the color capture feature?",
      answer: "Our color capture uses advanced camera technology to provide accurate color readings. For best results, ensure good lighting and hold your device steady when capturing colors."
    },
    {
      question: "Can I use TintPicks for professional design work?",
      answer: "Absolutely! TintPicks provides precise hex codes and comprehensive color information that's perfect for web design, graphic design, fashion, interior design, and any creative project."
    },
    {
      question: "Is my color data private?",
      answer: "Yes, your color collections and preferences are private to your account. We don't share your personal color data with third parties."
    }
  ];

  return (
    <div className="minimal-card p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-border rounded-lg px-4"
          >
            <AccordionTrigger className="text-left text-foreground hover:text-foreground">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;