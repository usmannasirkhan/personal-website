/* Journal data: use JSON-compatible entries (double-quoted keys and strings, no trailing commas).
   The Pages build excludes draft entries. Source files in a public repository remain public. */
window.PROJECTS = [
  {
    "slug": "changing-sdlc-sonar-acdc",
    "title": "How the SDLC is changing — and where Sonar’s AC/DC fits.",
    "category": "Notes",
    "description": "AI agents are changing how software moves from intent to production. A practical look at Sonar’s Agent Centric Development Cycle and what it means for engineering teams.",
    "status": "published",
    "visual": "orbit",
    "date": "2026-09-19",
    "content": [
      {
        "type": "paragraph",
        "text": "When an AI agent can inspect a repository, propose a change and run checks, the way work moves through a team starts to change. Sonar describes this as an agentic software development lifecycle, with agents participating in implementation, testing and debugging under human oversight. That raises a practical question: how should we organise delivery when people delegate more of the execution?",
        "source": {
          "label": "Sonar: what is the agentic SDLC?",
          "url": "https://www.sonarsource.com/resources/library/what-is-agentic-sdlc/"
        }
      },
      {
        "type": "paragraph",
        "text": "My starting point is the whole journey from a business need to a working service. Generating a patch is one part of that journey. Deciding what to build, resolving conflicting requirements, understanding dependencies and operating the result still need attention. If implementation gets faster, those other activities can become a larger share of the time needed to deliver value."
      },
      {
        "type": "heading",
        "text": "The lifecycle becomes a set of shorter feedback loops"
      },
      {
        "type": "paragraph",
        "text": "Good development teams already iterate. Agile delivery, continuous integration and DevOps established feedback throughout the lifecycle long before coding agents arrived. The useful change to examine is who performs each activity, what information they receive and how quickly the result can be checked."
      },
      {
        "type": "paragraph",
        "text": "I would expect teams adopting agents to reconsider each stage:"
      },
      {
        "type": "list",
        "items": [
          "Planning: turn a broad request into a bounded task with observable outcomes. Resolve ambiguity before it becomes an implementation assumption.",
          "Design: make relevant architectural decisions and constraints available where the work happens. Name the interfaces that must stay stable.",
          "Implementation: let the agent work in small increments, with feedback while the change is still easy to revise.",
          "Review: give reviewers the intent, scope, test results and unresolved questions alongside the diff, so they can assess the decision behind the code.",
          "Release and operation: retain explicit deployment controls, service ownership and production feedback. Successful generation does not settle whether a change is ready to run."
        ]
      },
      {
        "type": "heading",
        "text": "What Sonar means by AC/DC"
      },
      {
        "type": "paragraph",
        "text": "AC/DC stands for Agent Centric Development Cycle. Sonar presents it as three recurring activities around AI code generation: Guide, Verify and Solve. Guide supplies project context and constraints. Verify evaluates the generated change. Solve addresses findings and feeds the result back into the cycle. Generation remains the job of the chosen coding agent; the framework is intended to work across agents.",
        "source": {
          "label": "Sonar: the future of software development is AC/DC",
          "url": "https://www.sonarsource.com/blog/the-future-of-software-development-is-acdc/"
        }
      },
      {
        "type": "paragraph",
        "text": "I find that framing useful because it makes the work surrounding generation explicit. It gives a team three concrete questions: did we supply enough context, what evidence supports this change, and what happens when a check finds a problem? Those questions are useful whether a team is experimenting with one assistant or coordinating several agents."
      },
      {
        "type": "heading",
        "text": "Apply the idea beyond the editor"
      },
      {
        "type": "paragraph",
        "text": "Sonar’s current description places Guide, Verify and Solve across three loops: the agent’s development loop, CI verification and ongoing code maintenance. The scope therefore includes feedback during generation, checks as code enters the shared pipeline, and remediation of existing code. It treats maintenance as continuing work within the model.",
        "source": {
          "label": "Sonar: AC/DC and its three development loops",
          "url": "https://www.sonarsource.com/"
        }
      },
      {
        "type": "paragraph",
        "text": "My interpretation is that these loops need different responsibilities. Fast local feedback helps the agent revise its work. CI should check the proposed change against the repository’s agreed controls. Maintenance needs prioritisation: a technically valid fix still competes with other work for review, release capacity and operational attention."
      },
      {
        "type": "paragraph",
        "text": "I would keep the acceptance rules outside the agent’s discretion. An agent encountering a failing check should be able to propose a repair or explain a blocker. Changing the rule, suppressing the finding or widening its own permissions should require a separate decision by the responsible team. Otherwise, the mechanism intended to provide confidence becomes another part of the implementation being negotiated."
      },
      {
        "type": "heading",
        "text": "A practical example: changing a customer export"
      },
      {
        "type": "paragraph",
        "text": "Consider a hypothetical request to add a field to a customer-data export. The task sounds small, but the field may carry access restrictions, downstream consumers may depend on the existing format, and an export may be too large to build entirely in memory."
      },
      {
        "type": "paragraph",
        "text": "I would begin by recording who may see the new field, how the format can change and the expected volume. The agent could then implement a bounded change. During verification, the team would check permissions, compatibility and representative large exports, alongside the existing automated analysis. If a check fails, the next step is a targeted repair followed by another run of the relevant checks."
      },
      {
        "type": "paragraph",
        "text": "The release decision would still include the affected consumers and a recovery plan. After deployment, the service owner would watch export failures and processing time. That production feedback might uncover a new constraint for the next task. This is how I would connect an agent’s short coding loop to the longer lifecycle of a service."
      },
      {
        "type": "heading",
        "text": "Verification has limits that teams must understand"
      },
      {
        "type": "paragraph",
        "text": "A repeatable analysis result is valuable evidence within the scope of that analysis. It does not establish every business property of the system. In the export example, a checker cannot decide whether the organisation intended a particular customer role to see a field unless that requirement is represented in a rule or test it can evaluate."
      },
      {
        "type": "paragraph",
        "text": "I would therefore use AC/DC alongside product acceptance, integration testing, architecture review and operational readiness. The framework offers a way to organise feedback around agents. Teams still need to decide which checks matter for their system and who can accept the remaining uncertainty."
      },
      {
        "type": "heading",
        "text": "Measure whether the whole system improves"
      },
      {
        "type": "paragraph",
        "text": "For an initial pilot, I would choose one service and a recurring class of bounded changes. Record the current time from an agreed request to production, the review effort, the rework and the release problems. Then compare similar work using the new approach, including agent runtime and tooling costs."
      },
      {
        "type": "paragraph",
        "text": "If patches arrive sooner but spend longer awaiting review, the team has learnt where capacity is constrained. If recurring findings fall after the guidance improves, there is evidence that the feedback is useful. These observations give leaders something concrete to act on without treating code volume as a proxy for business value."
      },
      {
        "type": "paragraph",
        "text": "The change I would aim for is a lifecycle in which delegation comes with clear context, observable results and named ownership. Sonar’s AC/DC provides a useful structure for that conversation. Its value for a particular team should be demonstrated in the quality, cost and reliability of the software that reaches users."
      }
    ]
  },
  {
    "slug": "the-next-build",
    "title": "The next build.",
    "category": "Building",
    "description": "From the first idea to something real. A closer look at a project, the decisions and the details.",
    "status": "upcoming",
    "visual": "blueprint",
    "date": "",
    "content": []
  },
  {
    "slug": "room-to-experiment",
    "title": "Room to experiment.",
    "category": "Experiments",
    "description": "Small explorations, interesting questions and discoveries worth sharing along the way.",
    "status": "upcoming",
    "visual": "orbit",
    "date": "",
    "content": []
  },
  {
    "slug": "code-verification-ai-assisted-coding",
    "title": "AI-assisted coding needs stronger verification.",
    "category": "Notes",
    "description": "Generating code is only part of delivering software. Why independent checks, maintainability and evidence of correctness matter when AI helps us build.",
    "status": "published",
    "visual": "steps",
    "date": "2026-09-19",
    "content": [
      {
        "type": "paragraph",
        "text": "An AI assistant can produce an implementation, explain its design and write a set of tests in the same conversation. That is useful. It also makes it easy to mistake a complete-looking change for a verified one. Before that change reaches a customer, somebody still needs to establish whether it solves the intended problem and fits the system it is joining."
      },
      {
        "type": "paragraph",
        "text": "My view is that verification deserves a larger share of our attention as code becomes easier to generate. The question for an engineering leader is whether the team can turn that output into dependable software at a sustainable pace. Every change carries future work: reviewing it, operating it, diagnosing failures and adapting it when requirements move."
      },
      {
        "type": "heading",
        "text": "Plausible code still needs evidence"
      },
      {
        "type": "paragraph",
        "text": "GitHub’s guidance for Copilot acknowledges that generated suggestions can appear valid while being incorrect or failing to reflect the developer’s intent. It asks developers to review and test the output. That is a useful starting point for adoption: a suggestion should enter the engineering process with its assumptions open to examination.",
        "source": {
          "label": "GitHub: responsible use of inline suggestions",
          "url": "https://docs.github.com/en/copilot/responsible-use/inline-suggestions"
        }
      },
      {
        "type": "paragraph",
        "text": "Verification, as I use the term here, means collecting evidence against an agreed requirement. It includes running the software, checking the relevant boundaries and reviewing how the change interacts with its surroundings. A successful build answers one question. A passing test suite answers the questions encoded in that suite. Neither automatically establishes that we asked the right questions."
      },
      {
        "type": "heading",
        "text": "When the implementation and the tests share a mistake"
      },
      {
        "type": "paragraph",
        "text": "Consider a hypothetical invoice-download endpoint. An assistant adds a check that the requester is signed in, then retrieves an invoice by its identifier. The generated tests confirm that signed-in users receive an invoice and anonymous users are rejected. All tests pass."
      },
      {
        "type": "paragraph",
        "text": "The missing requirement is ownership. A signed-in customer must only be able to retrieve invoices belonging to their own account. The implementation and its tests can agree with each other while both missing that boundary. A test using two customer accounts would expose the gap: customer A must not receive customer B’s invoice, even when the identifier is valid."
      },
      {
        "type": "paragraph",
        "text": "This is why I would derive important acceptance cases from the requirement before asking an assistant to implement it. AI can help expand those cases, but the expected result needs a basis outside the generated implementation. A second AI review can raise useful questions; agreement between assistants is still weaker evidence than a relevant check that actually runs."
      },
      {
        "type": "heading",
        "text": "Make verification part of the work"
      },
      {
        "type": "paragraph",
        "text": "NIST’s code-verification guidance combines several techniques, including threat modelling, automated tests, static analysis, checks for embedded secrets and assessment of included software. It also recommends tests derived from requirements and cases designed to catch previous bugs. The practical lesson is to use complementary checks, because each exposes different weaknesses.",
        "source": {
          "label": "NIST: recommended minimum standard for code verification",
          "url": "https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity/software-supply-chain-security-guidance-3"
        }
      },
      {
        "type": "paragraph",
        "text": "For a team using AI assistance, I would build that approach into the normal path from request to release:"
      },
      {
        "type": "list",
        "items": [
          "Define the behaviour first. State what must happen, what must never happen and which assumptions need confirmation. Keep the change small enough for someone to understand.",
          "Inspect the proposed change. Check that it addresses the request, follows existing boundaries and uses APIs and dependencies that actually exist in the project’s environment.",
          "Run checks that can contradict it. Combine the relevant automated checks with cases for invalid inputs, permissions and failures. For a bug fix, confirm that the regression test detects the original defect.",
          "Exercise the integration. Test the changed behaviour with the surrounding system. A mocked dependency can hide a contract mismatch that only appears when components interact.",
          "Record the evidence. The review should say what was checked, what happened and what remains uncertain. Give the release an owner and a recovery approach appropriate to its impact."
        ]
      },
      {
        "type": "heading",
        "text": "Match the depth to the consequence"
      },
      {
        "type": "paragraph",
        "text": "A colour change on a personal website and a change to account permissions deserve different levels of scrutiny. For the first, visual and accessibility checks may provide the evidence needed. For the second, I would expect explicit access-control cases, integration testing and review by someone who understands the security boundary."
      },
      {
        "type": "paragraph",
        "text": "The same judgement applies to money movement, data deletion and database migrations. Ask what happens if the change is wrong, how quickly the team would notice and whether recovery is possible. Use those answers to decide the depth of verification. A uniform checklist can consume attention on minor changes while leaving consequential assumptions unexamined."
      },
      {
        "type": "heading",
        "text": "Include the cost of maintaining it"
      },
      {
        "type": "paragraph",
        "text": "A change can meet today’s acceptance criteria and still make tomorrow’s work harder. I would also ask whether it introduces unnecessary duplication, obscures a business rule or adds an abstraction the team cannot explain. The reviewer should be able to describe where the behaviour lives and how a future requirement would change it."
      },
      {
        "type": "paragraph",
        "text": "For leaders assessing AI adoption, I would track review turnaround, rework, escaped defects and the effort needed to modify recent changes alongside delivery time. Those measures need context: a team taking on harder work may see different results from one automating repetitive tasks. The aim is to understand where assistance improves delivery and where verification capacity needs investment."
      },
      {
        "type": "paragraph",
        "text": "Code verification is how a team earns confidence in a change. AI can help produce the code and help challenge it, but the decision to ship still needs an accountable owner and evidence proportionate to the consequences. That is the capability I would strengthen alongside any investment in AI-assisted development."
      }
    ]
  }
];
